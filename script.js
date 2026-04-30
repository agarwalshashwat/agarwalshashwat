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

// ─── 9. SIDE GUTTER SECTION TRACKER ───────────────────────────────────────
(function () {
  const numEl = document.querySelector('.gutter-section-num');
  if (!numEl) return;

  const sections = [
    { el: document.querySelector('.hero'),         num: '\u2014' },
    { el: document.querySelector('#about'),        num: '01'    },
    { el: document.querySelector('#skills'),       num: '02'    },
    { el: document.querySelector('#experience'),   num: '03'    },
    { el: document.querySelector('#ventures'),     num: '04'    },
    { el: document.querySelector('#contact'),      num: '05'    },
  ].filter(s => s.el);

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const match = sections.find(s => s.el === e.target);
      if (!match) return;
      numEl.classList.remove('tick');
      // force reflow for re-trigger
      void numEl.offsetWidth;
      numEl.textContent = match.num;
      numEl.classList.add('tick');
      setTimeout(() => numEl.classList.remove('tick'), 400);
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObs.observe(s.el));
})();

// ─── 10. CONSOLE EASTER EGG ────────────────────────────────────────────────
(function () {
  const s = {
    h: 'font-size:15px; font-weight:900; color:#c97a4e; font-family:monospace; line-height:2;',
    b: 'font-size:11px; color:#7a6e65; font-family:monospace; line-height:1.8;',
    l: 'font-size:11px; color:#c97a4e; font-weight:700; font-family:monospace; line-height:1.8;',
    d: 'font-size:11px; color:#2d5a43; font-weight:700; font-family:monospace; line-height:1.8;',
  };
  console.log('%c👋  Hey, curious dev.', s.h);
  console.log('%cYou opened DevTools. Respect.', s.b);
  console.log('%c─────────────────────────────────', s.b);
  console.log('%cBuilt by  →  Shashwat Agarwal', s.b);
  console.log('%cRole      →  SDE II & AI Engineer', s.b);
  console.log('%cStack     →  Python · FastAPI · LLMs · RAG', s.b);
  console.log('%c─────────────────────────────────', s.b);
  console.log('%c✉  agarwal.shashwat2012@gmail.com', s.l);
  console.log('%c🔗 linkedin.com/in/agarwalshashwat07', s.l);
  console.log('%c─────────────────────────────────', s.b);
  console.log('%cPS: there are more easter eggs on the page ;)', s.d);
})();

// ─── 11. EASTER EGG HELPERS ────────────────────────────────────────────────
(function () {
  const toast = document.querySelector('.easter-toast');
  if (!toast) return;

  function showToast(msg) {
    toast.textContent = msg;
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.setAttribute('aria-hidden', 'true'), 300);
    }, 3200);
  }

  // Konami code ↑↑↓↓←→←→BA
  const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kpos = 0;
  window.addEventListener('keydown', e => {
    kpos = (e.key === konamiSeq[kpos]) ? kpos + 1 : (e.key === konamiSeq[0] ? 1 : 0);
    if (kpos === konamiSeq.length) {
      kpos = 0;
      showToast('🎮 ↑↑↓↓←→←→BA — You clearly have good taste.');
    }
  });

  // Logo: click 5× quickly
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    let clicks = 0, resetTimer;
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      clicks++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clicks = 0; }, 1400);
      if (clicks >= 5) {
        clicks = 0;
        showToast('✨ SA = Shashwat Agarwal. Sharp eye!');
      }
    });
  }

  // Triple-click the hero name
  document.querySelector('.hero-name')?.addEventListener('click', e => {
    if (e.detail === 3) showToast('🏗️  Built with zero frameworks. Just HTML, CSS & JS.');
  });
})();

// ─── 12. APPLE-STYLE HERO SCROLL SCRUB ────────────────────────────────────
if (prefersMotion) {
  (function () {
    const hero       = document.querySelector('.hero');
    const heroTop    = document.querySelector('.hero-top');
    const heroBottom = document.querySelector('.hero-bottom');
    if (!hero || !heroTop || !heroBottom) return;

    function applyScrub() {
      const scrollY = window.scrollY;
      const heroH   = hero.offsetHeight;

      // p goes 0→1 as user scrolls through 85% of the hero height
      const p = Math.min(scrollY / (heroH * 0.85), 1);

      if (p <= 0) {
        // Back at top — clear inline styles so entrance animation state is clean
        heroTop.style.cssText    = '';
        heroBottom.style.cssText = '';
        return;
      }

      // ── hero-top: name + eyebrow evaporates (scale + blur + fade + lift) ──
      heroTop.style.transform = `scale(${1 - 0.08 * p}) translateY(${-p * 24}px)`;
      heroTop.style.filter    = `blur(${p * 12}px)`;
      heroTop.style.opacity   = 1 - p;

      // ── hero-bottom: role / desc / CTA fades faster, drifts down ──
      heroBottom.style.transform = `translateY(${p * 16}px)`;
      heroBottom.style.opacity   = Math.max(1 - p * 1.6, 0);
    }

    // Wait for entrance animations to finish before taking over
    setTimeout(() => {
      window.addEventListener('scroll', applyScrub, { passive: true });
      // Apply immediately in case page was reloaded mid-scroll
      applyScrub();
    }, 1800);
  })();
}

// ─── 13. MOBILE HAMBURGER NAV ──────────────────────────────────────────────
(function () {
  const btn    = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.nav-drawer');
  if (!btn || !drawer) return;

  function openDrawer() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  // Close when any drawer link is tapped
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
})();

