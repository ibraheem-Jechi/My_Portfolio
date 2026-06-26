/* ============================================================
   AI WIDGETS — AI Chat + AI Job Match
   Calls /api/chat and /api/match on the Next.js server.
   When opened from a static server on a different port than
   Next.js (e.g. Live Server :5500 vs Next.js :3000),
   we point directly at localhost:3000.
   ============================================================ */
/* API base: if we're already on a Next.js-like port (3000-3010), use relative URL.
   Otherwise (e.g. VS Code Live Server :5500), try /api/chat on same origin first —
   it will fail and fall back to Gemini direct if key is set. */
var AI_API_BASE = '';

/* Gemini direct REST call (used when iej_gemini_key is stored in localStorage) */
var GEMINI_MODEL = 'gemini-2.5-flash-lite';
var GEMINI_CONTEXT = 'You are an AI assistant on Ibrahim El Jichi\'s portfolio. Answer questions about Ibrahim in a warm, professional tone in 2-4 sentences max. Ibrahim is a Full-Stack Software Engineer based in Lebanon, open to remote/relocation. Currently at HAUZ (London, remote) building CreatorHQ — an AI-powered creator management platform. He built 88+ API endpoints, integrated 6 social platforms via Nango, owns Gmail API integration. Stack: Node.js, Express.js, TypeScript, React, Next.js, MongoDB, MySQL, Docker, Laravel, PHP, Flutter. Email: Ibrahimj02@outlook.com. If asked about salary, say he is happy to discuss by email. He is actively open to new opportunities.';

function geminiChat(messages) {
  var key = localStorage.getItem('iej_gemini_key');
  if (!key) return null;

  var history = messages.slice(0, -1).map(function(m) {
    return { role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] };
  });
  var lastMsg = messages[messages.length - 1];
  var fullPrompt = GEMINI_CONTEXT + '\n\nVisitor: ' + lastMsg.content;
  if (history.length) {
    var histText = messages.slice(0, -1).map(function(m) {
      return (m.role === 'user' ? 'Visitor' : 'You') + ': ' + m.content;
    }).join('\n');
    fullPrompt = GEMINI_CONTEXT + '\n\nConversation so far:\n' + histText + '\n\nVisitor: ' + lastMsg.content;
  }

  return fetch('https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: fullPrompt }] }] })
  }).then(function(r) { return r.json(); })
    .then(function(d) {
      var parts = (d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [];
      var text = parts.filter(function(p) { return !p.thought && p.text; }).map(function(p) { return p.text; }).join('').trim()
              || parts.filter(function(p) { return p.text; }).map(function(p) { return p.text; }).join('').trim();
      if (!text) throw new Error('Empty Gemini response');
      return { text: text };
    });
}

function geminiMatch(jobDescription) {
  var key = localStorage.getItem('iej_gemini_key');
  if (!key) return null;

  var IBRAHIM = 'Ibrahim El Jichi — Full-Stack Software Engineer\nSkills: React, Next.js, TypeScript, Node.js, Express.js, PHP, Laravel, Python, MongoDB, MySQL, Docker, Kubernetes, CI/CD, Flutter, SOLID, MVC, Agile\nExperience: Software Engineer at HAUZ/CreatorHQ (Node.js, TypeScript, MongoDB, 88+ API endpoints, 6 social platforms via Nango, Gmail API) — Feb 2026–Present. Intern at UNRWA & Digital Hub (MERN, Laravel, 100+ API endpoints, JWT auth, RBAC) — Jul–Dec 2025. Freelance Web Developer — Jun 2023–Present.\nProjects: CreatorHQ (AI platform, Node.js, MongoDB), Supermarket POS (MERN, barcode, analytics), RentHub (Next.js, SSR, MongoDB), Blood Bank (HTML5, email reminders, QR), Digital Hub (Laravel, PHP, MySQL)\nCerts: Full-Stack Bootcamp SeFactory 2025, CCNA 2022\nEducation: B.Eng. Computer Science & Comm. Engineering, LIU 2024\nLocation: Beirut, Lebanon — open to remote/relocation';

  var prompt = 'You are a technical recruiter AI analyzing a candidate fit for a job.\n\nCANDIDATE:\n' + IBRAHIM + '\n\nJOB DESCRIPTION:\n' + jobDescription.slice(0, 3000) + '\n\nRespond with ONLY valid JSON, no markdown:\n{"score":<0-100>,"matchingSkills":[<up to 6>],"relevantProjects":[<up to 3>],"pitch":"<2-3 sentence pitch to hiring manager>"}';

  return fetch('https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
  }).then(function(r) { return r.json(); })
    .then(function(d) {
      var parts = (d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [];
      var raw = parts.map(function(p) { return p.text || ''; }).join('').trim();
      var match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON');
      var parsed = JSON.parse(match[0]);
      return {
        score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
        matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills.slice(0, 6) : [],
        relevantProjects: Array.isArray(parsed.relevantProjects) ? parsed.relevantProjects.slice(0, 3) : [],
        pitch: typeof parsed.pitch === 'string' ? parsed.pitch : ''
      };
    });
}

/* ======================================================
   AI CHAT
   ====================================================== */
(function () {
  'use strict';

  var chatOpen = false;
  var messages = [];
  var loading = false;
  var typingTimer = null;

  var SUGGESTIONS = [
    'What AI projects has Ibrahim built?',
    "What's his tech stack?",
    'Is he available for hire?',
    'Tell me about his experience at HAUZ'
  ];

  /* --- Inject HTML --- */
  document.body.insertAdjacentHTML('beforeend',
    '<button class="ai-toggle" id="ai-toggle" aria-label="Open AI chat">' +
      '<span class="ai-toggle-pulse"></span>' +
      '<i class="fas fa-robot"></i>' +
      '<span class="ai-toggle-label">Ask AI</span>' +
    '</button>' +

    '<div class="ai-panel" id="ai-panel" role="dialog" aria-label="AI Chat">' +
      '<div class="ai-panel-header">' +
        '<div class="ai-avatar"><i class="fas fa-robot"></i></div>' +
        '<div class="ai-header-info">' +
          '<span class="ai-header-name">Ibrahim\'s AI</span>' +
          '<span class="ai-header-status"><span class="status-dot"></span> Online — ask me anything</span>' +
        '</div>' +
        '<button class="ai-close" id="ai-close" aria-label="Close"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="ai-messages" id="ai-messages"></div>' +
      '<form class="ai-input-form" id="ai-form">' +
        '<input class="ai-input" id="ai-input" placeholder="Ask about Ibrahim…" autocomplete="off">' +
        '<button type="submit" class="ai-send" id="ai-send" disabled aria-label="Send">' +
          '<i class="fas fa-paper-plane"></i>' +
        '</button>' +
      '</form>' +
      '<p class="ai-disclaimer"><i class="fas fa-bolt"></i> Powered by Gemini AI</p>' +
    '</div>'
  );

  var toggleBtn = document.getElementById('ai-toggle');
  var panel     = document.getElementById('ai-panel');
  var closeBtn  = document.getElementById('ai-close');
  var messagesEl = document.getElementById('ai-messages');
  var form      = document.getElementById('ai-form');
  var input     = document.getElementById('ai-input');
  var sendBtn   = document.getElementById('ai-send');

  function openChat() {
    chatOpen = true;
    toggleBtn.className = 'ai-toggle ai-toggle-open';
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    panel.classList.add('ai-panel-open');
    renderMessages();
    setTimeout(function () { input.focus(); }, 300);
  }

  function closeChat() {
    chatOpen = false;
    toggleBtn.className = 'ai-toggle';
    toggleBtn.innerHTML =
      '<span class="ai-toggle-pulse"></span>' +
      '<i class="fas fa-robot"></i>' +
      '<span class="ai-toggle-label">Ask AI</span>';
    panel.classList.remove('ai-panel-open');
  }

  toggleBtn.addEventListener('click', function () {
    if (chatOpen) closeChat(); else openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  input.addEventListener('input', function () {
    sendBtn.disabled = !this.value.trim() || loading;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMsg(input.value);
  });

  function renderMessages() {
    if (messages.length === 0) {
      var chips = SUGGESTIONS.map(function (s) {
        return '<button class="ai-chip" onclick="window.__aiSend(\'' + s.replace(/'/g, "\\'") + '\')">' + s + '</button>';
      }).join('');
      messagesEl.innerHTML =
        '<div class="ai-welcome">' +
          '<div class="ai-welcome-icon"><i class="fas fa-robot"></i></div>' +
          '<p>Hi! I\'m an AI built to represent Ibrahim. Ask me about his projects, experience, or skills — I\'ll answer instantly.</p>' +
          '<div class="ai-suggestions">' + chips + '</div>' +
        '</div>';
      return;
    }

    var html = messages.map(function (m) {
      var content = m.content === '__typing__'
        ? '<span class="ai-dots"><span></span><span></span><span></span></span>'
        : escHtml(m.content);
      return '<div class="ai-msg ai-msg-' + m.role + '">' +
               '<div class="ai-bubble">' + content + '</div>' +
             '</div>';
    }).join('');
    messagesEl.innerHTML = html;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  window.__aiSend = function (text) { sendMsg(text); };

  function sendMsg(text) {
    text = text.trim();
    if (!text || loading) return;

    messages.push({ role: 'user', content: text });
    input.value = '';
    sendBtn.disabled = true;
    loading = true;
    messages.push({ role: 'assistant', content: '__typing__' });
    renderMessages();

    var chatPromise = geminiChat(messages.slice(0, -1).concat([{ role: 'user', content: text }]));
    if (!chatPromise) {
      chatPromise = fetch(AI_API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.slice(0, -1) })
      }).then(function(r) { return r.json(); });
    }
    chatPromise
    .then(function (data) {
      var reply = (data && data.text) || "Sorry, I couldn't respond right now. Please email Ibrahim at Ibrahimj02@outlook.com.";
      messages[messages.length - 1] = { role: 'assistant', content: '' };
      loading = false;

      var i = 0;
      clearInterval(typingTimer);
      typingTimer = setInterval(function () {
        i++;
        messages[messages.length - 1].content = reply.slice(0, i);
        renderMessages();
        if (i >= reply.length) { clearInterval(typingTimer); typingTimer = null; }
      }, 12);
    })
    .catch(function () {
      messages[messages.length - 1] = {
        role: 'assistant',
        content: "Sorry, I couldn't connect right now. Please email Ibrahim at Ibrahimj02@outlook.com."
      };
      loading = false;
      renderMessages();
    });
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();


/* ======================================================
   AI JOB MATCH
   ====================================================== */
(function () {
  'use strict';

  var jmOpen   = false;
  var jobDesc  = '';
  var loading  = false;
  var result   = null;
  var timers   = [];

  /* --- Inject HTML --- */
  document.body.insertAdjacentHTML('beforeend',
    '<button class="jm-toggle" id="jm-toggle" aria-label="Open AI Job Match Analyzer">' +
      '<span class="jm-pulse"></span>' +
      '<i class="fas fa-chart-line"></i>' +
      '<span class="jm-toggle-label">Match Score</span>' +
    '</button>' +

    '<div class="jm-overlay" id="jm-overlay">' +
      '<div class="jm-modal" id="jm-modal">' +
        '<div class="jm-header">' +
          '<div class="jm-header-left">' +
            '<div class="jm-header-icon"><i class="fas fa-brain"></i></div>' +
            '<div>' +
              '<div class="jm-header-title">AI Job Match</div>' +
              '<div class="jm-header-sub">Gemini-powered · Instant analysis</div>' +
            '</div>' +
          '</div>' +
          '<button class="jm-close" id="jm-close" aria-label="Close"><i class="fas fa-times"></i></button>' +
        '</div>' +
        '<div id="jm-body"></div>' +
      '</div>' +
    '</div>'
  );

  var toggleBtn = document.getElementById('jm-toggle');
  var overlay   = document.getElementById('jm-overlay');
  var closeBtn  = document.getElementById('jm-close');
  var bodyEl    = document.getElementById('jm-body');

  function openJM() {
    jmOpen = true;
    toggleBtn.classList.add('jm-toggle-open');
    overlay.classList.add('jm-overlay-open');
    renderBody();
  }
  function closeJM() {
    jmOpen = false;
    toggleBtn.classList.remove('jm-toggle-open');
    overlay.classList.remove('jm-overlay-open');
    resetJM();
  }
  function resetJM() {
    clearTimers();
    result  = null;
    loading = false;
    jobDesc = '';
    renderBody();
  }

  toggleBtn.addEventListener('click', function () { if (jmOpen) closeJM(); else openJM(); });
  closeBtn.addEventListener('click', closeJM);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeJM(); });

  function clearTimers() {
    timers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
    timers = [];
  }

  /* --- Render states --- */
  function renderBody() {
    if (loading) {
      bodyEl.innerHTML =
        '<div class="jm-body jm-loading-state">' +
          '<div class="jm-neural">' +
            '<div class="jm-n n1"></div><div class="jm-n n2"></div><div class="jm-n n3"></div>' +
            '<div class="jm-n n4"></div><div class="jm-n n5"></div>' +
            '<svg class="jm-n-lines" viewBox="0 0 120 120" fill="none">' +
              '<line x1="20" y1="20" x2="60" y2="60" stroke="currentColor" stroke-width="1" class="nl nl1"/>' +
              '<line x1="100" y1="20" x2="60" y2="60" stroke="currentColor" stroke-width="1" class="nl nl2"/>' +
              '<line x1="20" y1="100" x2="60" y2="60" stroke="currentColor" stroke-width="1" class="nl nl3"/>' +
              '<line x1="100" y1="100" x2="60" y2="60" stroke="currentColor" stroke-width="1" class="nl nl4"/>' +
              '<line x1="20" y1="20" x2="100" y2="20" stroke="currentColor" stroke-width="1" class="nl nl5"/>' +
              '<line x1="20" y1="100" x2="100" y2="100" stroke="currentColor" stroke-width="1" class="nl nl5"/>' +
            '</svg>' +
          '</div>' +
          '<p class="jm-loading-label">Analyzing job requirements</p>' +
          '<div class="jm-loading-dots"><span></span><span></span><span></span></div>' +
        '</div>';
      return;
    }

    if (result) {
      renderResults();
      return;
    }

    /* Input state */
    bodyEl.innerHTML =
      '<div class="jm-body jm-input-state">' +
        '<div class="jm-intro">' +
          '<span class="jm-intro-tag">RECRUITER TOOL</span>' +
          '<p>Paste a job description and the AI will score how well Ibrahim fits — including matching skills, relevant projects, and a personalized pitch.</p>' +
        '</div>' +
        '<div class="jm-textarea-wrap">' +
          '<textarea class="jm-textarea" id="jm-textarea" rows="5" placeholder="We\'re looking for a Full-Stack Engineer with 3+ years of experience in React, Node.js, and cloud infrastructure…"></textarea>' +
          '<div class="jm-char-hint" id="jm-char-hint">paste or type</div>' +
        '</div>' +
        '<button class="jm-analyze-btn" id="jm-analyze" disabled>' +
          '<i class="fas fa-bolt"></i>' +
          '<span>Analyze Match</span>' +
          '<div class="jm-btn-shine"></div>' +
        '</button>' +
      '</div>';

    var ta        = document.getElementById('jm-textarea');
    var charHint  = document.getElementById('jm-char-hint');
    var analyzeBtn = document.getElementById('jm-analyze');

    ta.addEventListener('input', function () {
      jobDesc = this.value;
      charHint.textContent = jobDesc.length > 0 ? jobDesc.length + ' chars' : 'paste or type';
      analyzeBtn.disabled = !jobDesc.trim();
    });

    analyzeBtn.addEventListener('click', function () {
      if (!jobDesc.trim()) return;
      loading = true;
      renderBody();
      doAnalyze();
    });
  }

  function doAnalyze() {
    var matchPromise = geminiMatch(jobDesc);
    if (!matchPromise) {
      matchPromise = fetch(AI_API_BASE + '/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobDesc })
      }).then(function(r) {
        if (!r.ok) throw new Error('API error');
        return r.json();
      });
    }
    matchPromise
    .then(function (data) {
      loading = false;
      result = data;
      renderBody();
      animateResult();
    })
    .catch(function () {
      loading = false;
      result = { score: 0, matchingSkills: [], relevantProjects: [], pitch: 'Analysis could not be completed. Please try again.' };
      renderBody();
      animateResult();
    });
  }

  function renderResults() {
    var circumference = 2 * Math.PI * 54;
    bodyEl.innerHTML =
      '<div class="jm-body jm-results-state">' +
        '<div class="jm-score-block">' +
          '<div class="jm-ring-wrap" id="jm-ring-wrap">' +
            '<svg width="148" height="148" viewBox="0 0 148 148" class="jm-ring-svg">' +
              '<circle cx="74" cy="74" r="54" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>' +
              '<circle id="jm-ring-arc" cx="74" cy="74" r="54" fill="none" stroke="rgba(255,255,255,0.08)"' +
                ' stroke-width="10" stroke-linecap="round"' +
                ' stroke-dasharray="' + circumference + '"' +
                ' stroke-dashoffset="' + circumference + '"' +
                ' transform="rotate(-90 74 74)"/>' +
            '</svg>' +
            '<div class="jm-ring-inner">' +
              '<span class="jm-score-num" id="jm-score-num">0</span>' +
              '<span class="jm-score-pct" id="jm-score-pct">%</span>' +
              '<span class="jm-score-word">match</span>' +
            '</div>' +
          '</div>' +
          '<div class="jm-verdict" id="jm-verdict"></div>' +
        '</div>' +
        '<div id="jm-skills-section"></div>' +
        '<div id="jm-projects-section"></div>' +
        '<div id="jm-pitch-section"></div>' +
        '<button class="jm-retry-btn" id="jm-retry"><i class="fas fa-redo"></i> Try Another Job</button>' +
      '</div>';

    document.getElementById('jm-retry').addEventListener('click', resetJM);
  }

  function animateResult() {
    if (!result) return;
    clearTimers();

    var circumference = 2 * Math.PI * 54;
    var target  = result.score;
    var start   = Date.now();
    var dur     = 1200;

    var scoreTimer = setInterval(function () {
      var elapsed  = Date.now() - start;
      var progress = Math.min(elapsed / dur, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var current  = Math.floor(eased * target);

      var color = current >= 80 ? '#10b981' : current >= 60 ? '#f59e0b' : current > 0 ? '#ef4444' : 'rgba(255,255,255,0.08)';
      var glow  = current >= 80 ? 'rgba(16,185,129,0.35)' : current >= 60 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)';

      var numEl    = document.getElementById('jm-score-num');
      var pctEl    = document.getElementById('jm-score-pct');
      var arcEl    = document.getElementById('jm-ring-arc');
      var wrapEl   = document.getElementById('jm-ring-wrap');
      var verdictEl = document.getElementById('jm-verdict');

      if (numEl) { numEl.textContent = current; numEl.style.color = color; }
      if (pctEl) { pctEl.style.color = color; }
      if (arcEl) {
        arcEl.style.stroke = color;
        arcEl.style.strokeDashoffset = circumference - (current / 100) * circumference;
      }
      if (wrapEl) { wrapEl.style.filter = 'drop-shadow(0 0 20px ' + glow + ')'; }

      if (progress >= 1) {
        clearInterval(scoreTimer);
        if (verdictEl && target > 0) {
          var verdict = target >= 80 ? 'Strong Fit' : target >= 60 ? 'Good Fit' : target >= 40 ? 'Partial Fit' : 'Low Match';
          verdictEl.textContent = verdict;
          verdictEl.style.color = color;
        }

        /* Animate skills */
        var skills = result.matchingSkills || [];
        var skillsEl = document.getElementById('jm-skills-section');
        if (skills.length && skillsEl) {
          skillsEl.innerHTML =
            '<div class="jm-section">' +
              '<div class="jm-section-title"><i class="fas fa-check-circle"></i> Matching Skills</div>' +
              '<div class="jm-chips" id="jm-skills-chips"></div>' +
            '</div>';
          var chipsEl = document.getElementById('jm-skills-chips');
          var idx = 0;
          var skillTimer = setInterval(function () {
            if (!chipsEl) { clearInterval(skillTimer); return; }
            var chip = document.createElement('span');
            chip.className = 'jm-chip jm-chip-skill';
            chip.textContent = skills[idx];
            chipsEl.appendChild(chip);
            idx++;
            if (idx >= skills.length) {
              clearInterval(skillTimer);

              /* Animate projects */
              var projs = result.relevantProjects || [];
              var projsEl = document.getElementById('jm-projects-section');
              if (projs.length && projsEl) {
                projsEl.innerHTML =
                  '<div class="jm-section">' +
                    '<div class="jm-section-title"><i class="fas fa-folder-open"></i> Relevant Projects</div>' +
                    '<div class="jm-chips">' +
                      projs.map(function (p) { return '<span class="jm-chip jm-chip-project">' + p + '</span>'; }).join('') +
                    '</div>' +
                  '</div>';
              }

              /* Type pitch */
              var pitch = result.pitch || '';
              var pitchEl = document.getElementById('jm-pitch-section');
              if (pitch && pitchEl) {
                pitchEl.innerHTML =
                  '<div class="jm-pitch">' +
                    '<i class="fas fa-quote-left jm-pitch-icon"></i>' +
                    '<p class="jm-pitch-text" id="jm-pitch-text"></p>' +
                  '</div>';
                var pitchTextEl = document.getElementById('jm-pitch-text');
                var c = 0;
                var delayId = setTimeout(function () {
                  var typeTimer = setInterval(function () {
                    c++;
                    if (!pitchTextEl) { clearInterval(typeTimer); return; }
                    var remaining = pitch.length - c;
                    pitchTextEl.innerHTML =
                      pitch.slice(0, c) +
                      (remaining > 0 ? '<span class="jm-cursor"></span>' : '');
                    if (c >= pitch.length) clearInterval(typeTimer);
                  }, 14);
                  timers.push(typeTimer);
                }, 250);
                timers.push(delayId);
              }
            }
          }, 150);
          timers.push(skillTimer);
        }
      }
    }, 16);
    timers.push(scoreTimer);
  }

})();
