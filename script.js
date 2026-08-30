const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const projects = [...document.querySelectorAll('.project[data-category]')];
const filterStatus = document.querySelector('.filter-status');
const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

function closeMenu() {
  navLinks?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
}

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navLinks?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter ?? 'all';
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    projects.forEach((project) => {
      const visible = filter === 'all' || project.dataset.category === filter;
      project.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (filterStatus) {
      filterStatus.textContent = filter === 'all'
        ? 'Showing all 5 projects.'
        : `Showing ${visibleCount} ${button.textContent.trim().toLowerCase()} project${visibleCount === 1 ? '' : 's'}.`;
    }
  });
});

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navigationLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] });

  sections.forEach((section) => observer.observe(section));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
