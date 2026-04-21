// Scroll fade-in animation
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Dynamic years of experience from Aug 2021
(function() {
  const start = new Date(2021, 7, 1); // Aug 2021
  const now = new Date();
  const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
  const floored = Math.floor(years * 2) / 2; // round down to nearest 0.5
  document.getElementById('years-exp').textContent = floored + '+';
})();
