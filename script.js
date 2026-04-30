// ─── 1. SCROLL FADE-IN (general) ───────────────────────────────────────────
const fadeObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ─── 2. DYNAMIC YEARS OF EXPERIENCE ────────────────────────────────────────
(function () {
  const start = new Date(2021, 7, 1); // Aug 2021
  const now = new Date();
  const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
  const floored = Math.floor(years * 2) / 2;
  const el = document.getElementById('years-exp');
  if (el) {
    el.textContent = floored + '+';
    el.dataset.count = floored;
  }
})();

// ─── 3. STATS COUNT-UP ──────────────────────────────────────────────────────
const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

if (prefersMotion) {
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          const val = target * eased;
          el.textContent = (isDecimal ? (Math.round(val * 2) / 2).toFixed(1) : Math.floor(val)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
}

// ─── 4. SKILLS STAGGERED ENTRANCE ──────────────────────────────────────────
const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) {
  const tags = skillsGrid.querySelectorAll('.skill-tag');
  tags.forEach(tag => tag.classList.add('fade-in'));

  const skillsObserver = new IntersectionObserver(
    (entries, obs) => {
      if (!entries[0].isIntersecting) return;
      tags.forEach((tag, i) => {
        setTimeout(() => tag.classList.add('visible'), i * 28);
      });
      obs.unobserve(skillsGrid);
    },
    { threshold: 0.05 }
  );
  skillsObserver.observe(skillsGrid);
}

// ─── 5. EXPERIENCE & VENTURES STAGGERED ROWS ───────────────────────────────
function staggerSection(sectionId, itemSelector, delay) {
  const section = document.querySelector(sectionId);
  if (!section) return;
  const items = section.querySelectorAll(itemSelector);
  items.forEach(item => item.classList.add('fade-in'));

  const obs = new IntersectionObserver(
    (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      items.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * delay);
      });
      observer.unobserve(section);
    },
    { threshold: 0.05 }
  );
  obs.observe(section);
}
staggerSection('#experience', '.exp-item', 80);
staggerSection('#ventures',   '.venture-item', 80);

// ─── 6. NAV HIDE ON SCROLL-DOWN ────────────────────────────────────────────
(function () {
  const nav = document.querySelector('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 80) {
      nav.classList.add('nav-scrolled-down');
    } else {
      nav.classList.remove('nav-scrolled-down');
    }
    lastY = y;
  }, { passive: true });
})();

// ─── 7. SCROLL PROGRESS BAR ────────────────────────────────────────────────
(function () {
  const bar = document.querySelector('.scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (Math.min(pct, 1) * 100) + '%';
  }, { passive: true });
})();

// ─── 8. CUSTOM CURSOR ──────────────────────────────────────────────────────
(function () {
  if (!prefersMotion) return;
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  // Only activate on true pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  (function lerp() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  document.querySelectorAll('a, button, .btn, .skill-tag, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

