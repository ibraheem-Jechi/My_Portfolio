/* ============================================================
   NAVBAR — scroll effect & active state
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const toggle   = document.getElementById('menu-toggle');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightNav();
});

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
  });
});

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 100;

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
const phrases = [
  'Software Engineer.',
  'API Builder.',
  'AI Platform Dev.',
  'Next.js Expert.',
  'Problem Solver.',
];

let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typewriter');

function typeLoop() {
  const word = phrases[pi];
  if (deleting) {
    el.textContent = word.slice(0, ci - 1);
    ci--;
  } else {
    el.textContent = word.slice(0, ci + 1);
    ci++;
  }

  if (!deleting && ci === word.length) {
    setTimeout(() => { deleting = true; typeLoop(); }, 2200);
    return;
  }
  if (deleting && ci === 0) {
    deleting = false;
    pi = (pi + 1) % phrases.length;
  }

  setTimeout(typeLoop, deleting ? 45 : 75);
}

setTimeout(typeLoop, 800);

/* ============================================================
   PROFILE PHOTO — fallback to initials
   ============================================================ */
const photo    = document.getElementById('profile-photo');
const fallback = document.getElementById('photo-fallback');

if (photo) {
  photo.addEventListener('error', () => {
    photo.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
  });
  photo.addEventListener('load', () => {
    if (fallback) fallback.style.display = 'none';
  });
}

/* ============================================================
   INTERSECTION OBSERVER — reveal on scroll
   ============================================================ */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (e.target.dataset.delay || 0) + 'ms';
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach((el, idx) => {
  el.dataset.delay = (idx % 5) * 80;
  revealObs.observe(el);
});

/* ============================================================
   STATS COUNTER ANIMATION
   ============================================================ */
const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(num => {
          const target = parseInt(num.dataset.target, 10);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 50));
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            num.textContent = current;
            if (current >= target) clearInterval(timer);
          }, 28);
        });
        counterObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const statsRow = document.querySelector('.stats-row');
if (statsRow) counterObs.observe(statsRow);

/* ============================================================
   CONTACT FORM
   ============================================================ */
const form = document.getElementById('contact-form');
const toast = document.getElementById('toast');

function showToast(msg, isError = false) {
  const icon = toast.querySelector('i');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  toast.style.borderColor = isError ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.35)';
  toast.style.color = isError ? '#fca5a5' : '#86efac';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const msg   = form.querySelector('#message').value.trim();

    if (!name || !email || !msg) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      showToast('Your message has been sent. I\'ll be in touch soon!');
      form.reset();

      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
