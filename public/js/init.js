/* ============================================================
   PORTFOLIO CONTENT INITIALIZER
   Runs before main.js. Reads from window.PS and renders all
   dynamic sections: hero, about, experience, projects, certs.
   ============================================================ */
(function () {
  'use strict';

  if (typeof window.PS === 'undefined') return;

  var c = window.PS.get();

  /* ---- Hero tagline ---- */
  var taglineEl = document.getElementById('hero-tagline');
  if (taglineEl && c.hero && c.hero.tagline) {
    taglineEl.innerHTML = c.hero.tagline;
  }

  /* ---- Cycling role badge ---- */
  var roleBadgeText = document.getElementById('role-badge-text');
  var roleBadge     = document.getElementById('role-badge');
  if (roleBadgeText && roleBadge && c.hero && Array.isArray(c.hero.roles) && c.hero.roles.length) {
    var roles  = c.hero.roles;
    var roleIdx = 0;
    roleBadgeText.textContent = roles[0];
    setInterval(function () {
      roleBadge.classList.add('fading');
      setTimeout(function () {
        roleIdx = (roleIdx + 1) % roles.length;
        roleBadgeText.textContent = roles[roleIdx];
        roleBadge.classList.remove('fading');
      }, 380);
    }, 2800);
  }

  /* ---- Availability status badge ---- */
  var badge = document.getElementById('hero-badge');
  if (badge) {
    var dot  = badge.querySelector('.status-dot');
    var dotHtml = dot ? '<span class="status-dot"></span> ' : '';
    badge.innerHTML = dotHtml + c.status.text;
    if (!c.status.available) {
      badge.className = badge.className.replace('badge-available', 'badge-unavailable');
    }
  }

  /* ---- About paragraphs ---- */
  if (c.about) {
    var p1 = document.getElementById('about-p1');
    var p2 = document.getElementById('about-p2');
    var p3 = document.getElementById('about-p3');
    if (p1 && c.about.p1) p1.innerHTML = c.about.p1;
    if (p2 && c.about.p2) p2.innerHTML = c.about.p2;
    if (p3 && c.about.p3) p3.innerHTML = c.about.p3;

    var locEl  = document.getElementById('about-location');
    var eduEl  = document.getElementById('about-education');
    var langEl = document.getElementById('about-languages');
    if (locEl  && c.about.location)  locEl.textContent  = c.about.location;
    if (eduEl  && c.about.education) eduEl.textContent  = c.about.education;
    if (langEl && c.about.languages) langEl.textContent = c.about.languages;
  }

  /* ---- Stats ---- */
  var statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(function (el) {
    var key = el.getAttribute('data-stat');
    if      (key === 'years')    el.setAttribute('data-target', c.stats.years);
    else if (key === 'projects') el.setAttribute('data-target', c.stats.projects);
    else if (key === 'stacks')   el.setAttribute('data-target', c.stats.stacks);
    else if (key === 'langs')    el.setAttribute('data-target', c.stats.languages);
  });
  var yearsNum = document.querySelector('.stat-num[data-stat="years"]');
  if (yearsNum) {
    var lbl = yearsNum.parentElement && yearsNum.parentElement.querySelector('.stat-lbl');
    if (lbl) lbl.textContent = c.stats.yearsLabel;
  }

  /* ---- Social link hrefs ---- */
  document.querySelectorAll('a[data-link="github"]').forEach(function (el)   { el.href = c.github; });
  document.querySelectorAll('a[data-link="linkedin"]').forEach(function (el) { el.href = c.linkedin; });

  /* ---- Phone + WhatsApp ---- */
  var phoneTel = document.querySelector('a[href^="tel:"]');
  if (phoneTel) phoneTel.href = 'tel:' + c.phone.replace(/\s/g, '');
  var phoneWa = document.querySelector('a[href^="https://wa.me/"]');
  if (phoneWa) phoneWa.href = 'https://wa.me/' + c.phone.replace(/[^0-9]/g, '');
  var phoneTxt = document.querySelector('.phone-number-text');
  if (phoneTxt) phoneTxt.textContent = c.phone;

  /* ---- Experience ---- */
  function renderExperience(experience) {
    var container = document.getElementById('experience-container');
    if (!container) return;
    container.innerHTML = experience.map(function (e) {
      var companyRow = e.current
        ? '<div class="tl-company-row"><span class="tl-company">' + escHtml(e.company) + '</span><span class="tl-badge current">Current</span></div>'
        : '<span class="tl-company">' + escHtml(e.company) + '</span>';

      var bullets = (e.bullets || []).map(function (b) {
        return '<li>' + escHtml(b) + '</li>';
      }).join('');

      var tags = (e.tags || []).map(function (t) {
        return '<span>' + escHtml(t) + '</span>';
      }).join('');

      return '<div class="tl-item reveal">'
        + '<div class="tl-dot"><div class="tl-dot-inner"></div></div>'
        + '<div class="tl-card">'
        +   '<div class="tl-head">'
        +     '<div class="tl-info">'
        +       '<h3 class="tl-role">' + escHtml(e.role) + '</h3>'
        +       companyRow
        +     '</div>'
        +     '<div class="tl-meta">'
        +       '<span class="tl-date"><i class="fas fa-calendar-alt"></i> ' + escHtml(e.date) + '</span>'
        +       '<span class="tl-loc"><i class="fas fa-map-marker-alt"></i> ' + escHtml(e.location) + '</span>'
        +     '</div>'
        +   '</div>'
        +   (bullets ? '<ul class="tl-bullets">' + bullets + '</ul>' : '')
        +   (tags    ? '<div class="tl-tags">'   + tags    + '</div>' : '')
        + '</div>'
        + '</div>';
    }).join('');
  }

  /* ---- Projects ---- */
  function renderProjects(projects) {
    var container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = projects.map(function (p) {
      var links = '';
      if (p.lock) {
        links = '<span class="proj-link proj-lock" title="Private repository"><i class="fas fa-lock"></i></span>';
      } else {
        if (p.github) links += '<a href="' + p.github + '" class="proj-link" title="GitHub" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>';
        if (p.demo)   links += '<a href="' + p.demo   + '" class="proj-link" title="Live Demo" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i></a>';
      }
      var badgeHtml = p.badge ? '<span class="project-badge badge-' + (p.badgeType || 'progress') + '">' + p.badge + '</span>' : '';
      var stackHtml = p.stack.map(function (s) { return '<span>' + s + '</span>'; }).join('');

      if (p.featured) {
        return '<div class="project-card project-featured reveal">'
          + '<div class="project-visual ' + p.visual + '"><div class="project-gfx">'
          + '<div class="gfx-icon"><i class="fas ' + p.icon + '"></i></div>'
          + '<div class="gfx-ring"></div><div class="gfx-ring gfx-ring-2"></div>'
          + '</div></div>'
          + '<div class="project-body"><div class="project-top"><div>' + badgeHtml + '<h3 class="project-name">' + p.name + '</h3></div>'
          + '<div class="project-links">' + links + '</div></div>'
          + '<p class="project-desc">' + p.desc + '</p>'
          + '<div class="project-stack">' + stackHtml + '</div></div></div>';
      }
      return '<div class="project-card reveal">'
        + '<div class="project-visual ' + p.visual + '"><div class="project-gfx">'
        + '<div class="gfx-icon"><i class="fas ' + p.icon + '"></i></div><div class="gfx-ring"></div>'
        + '</div></div>'
        + '<div class="project-body"><div class="project-top"><h3 class="project-name">' + p.name + '</h3>'
        + '<div class="project-links">' + links + '</div></div>'
        + '<p class="project-desc">' + p.desc + '</p>'
        + '<div class="project-stack">' + stackHtml + '</div></div></div>';
    }).join('');
  }

  /* ---- Certificates ---- */
  function renderCerts(certs) {
    var container = document.getElementById('certs-container');
    if (!container) return;
    container.innerHTML = certs.map(function (cert) {
      return '<div class="cert-card reveal">'
        + '<div class="cert-icon-badge"><i class="fas ' + cert.icon + '"></i></div>'
        + '<div class="cert-info"><h4>' + cert.name + '</h4>'
        + '<span class="cert-issuer">' + cert.issuer + '</span>'
        + '<span class="cert-year">' + cert.year + '</span></div>'
        + '<div class="cert-check"><i class="fas fa-check-circle"></i></div>'
        + '</div>';
    }).join('');
  }

  function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  renderExperience(c.experience);
  renderProjects(c.projects);
  renderCerts(c.certificates);

})();
