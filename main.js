// Generate twinkling stars
(function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  const count = window.innerWidth < 600 ? 60 : 110;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 2.2 + 0.6;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
    star.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(star);
  }
})();

// Smooth scroll for anchor links (extra safety)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
