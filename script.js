const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const darkToggleBtn = document.getElementById('dark-toggle');
const prefersDark = localStorage.getItem('theme') === 'dark';

if (prefersDark) document.body.classList.add('dark-mode');

if (darkToggleBtn) {
  const setThemeIcon = () => {
    darkToggleBtn.innerHTML = document.body.classList.contains('dark-mode')
      ? '<i class="fa fa-sun-o"></i>'
      : '<i class="fa fa-moon-o"></i>';
  };

  darkToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setThemeIcon();
  });

  setThemeIcon();
}

const revealEls = document.querySelectorAll('[data-reveal]');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  });

  revealEls.forEach(el => revealObserver.observe(el));
}

const backBtn = document.getElementById('back-to-top');
const nav = document.querySelector('.top-nav');
const progressBar = document.getElementById('scroll-progress');
const hero = document.querySelector('.parallax-hero');
const navLinks = document.querySelectorAll('.nav-links a');
const navSectionIds = Array.from(navLinks)
  .map(link => link.getAttribute('href') || '')
  .filter(href => href.includes('#'))
  .map(href => href.slice(href.indexOf('#') + 1))
  .filter(Boolean);
const sections = navSectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

let lastScroll = window.scrollY;
let scrollTicking = false;

const setActiveNavLink = () => {
  let current = '';
  const activationLine = Math.min(window.innerHeight * 0.28, 180);

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= activationLine && rect.bottom > activationLine) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const hashIndex = href.indexOf('#');
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
    link.classList.toggle('active', Boolean(current && hash === `#${current}`));
  });

  if (!current) {
    const pageLink = document.querySelector(`.nav-links a[href="${currentPage}"]`);
    if (pageLink) pageLink.classList.add('active');
  }
};

const updateScrollEffects = () => {
  const scrollY = window.scrollY;
  const doc = document.documentElement;
  const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  if (progressBar) {
    progressBar.style.transform = `scaleX(${scrollProgress})`;
  }

  if (backBtn) {
    backBtn.classList.toggle('show', scrollY > 400);
  }

  if (nav) {
    const shouldHide = scrollY > lastScroll && scrollY > 80;
    nav.style.transform = shouldHide ? 'translateY(-100%)' : 'translateY(0)';
  }

  if (hero && !prefersReducedMotion) {
    const heroHeight = Math.max(hero.offsetHeight, 1);
    const heroDistance = Math.min(scrollY, heroHeight);
    hero.style.setProperty('--hero-content-y', `${heroDistance * 0.12}px`);
    hero.style.setProperty('--hero-bg-y', `${heroDistance * 0.22}px`);
  }

  setActiveNavLink();
  lastScroll = scrollY;
  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  window.requestAnimationFrame(updateScrollEffects);
}, { passive: true });

updateScrollEffects();

const heroVisual = document.querySelector('.hero-visual');
const wireCube = document.querySelector('.wire-cube');

if (heroVisual && wireCube && !prefersReducedMotion) {
  const cubeMotion = {
    baseX: -16,
    currentX: -16,
    currentY: 0,
    dragX: 0,
    dragY: 0,
    hoverX: 0,
    hoverY: 0,
    idleY: 0,
    isDragging: false,
    isHovering: false,
    lastX: 0,
    lastY: 0,
    targetHoverX: 0,
    targetHoverY: 0
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateHoverRotation = (clientX, clientY) => {
    const rect = heroVisual.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = clamp((clientX - centerX) / (rect.width / 2), -1, 1);
    const offsetY = clamp((clientY - centerY) / (rect.height / 2), -1, 1);

    cubeMotion.targetHoverY = offsetX * 12;
    cubeMotion.targetHoverX = offsetY * -10;
  };

  const animateCube = () => {
    if (!cubeMotion.isDragging) {
      cubeMotion.idleY = (cubeMotion.idleY + 0.055) % 360;
    }

    const hoverEase = cubeMotion.isHovering || cubeMotion.isDragging ? 0.12 : 0.08;
    cubeMotion.hoverX += (cubeMotion.targetHoverX - cubeMotion.hoverX) * hoverEase;
    cubeMotion.hoverY += (cubeMotion.targetHoverY - cubeMotion.hoverY) * hoverEase;

    const targetX = cubeMotion.baseX + cubeMotion.hoverX + cubeMotion.dragX;
    const targetY = cubeMotion.idleY + cubeMotion.hoverY + cubeMotion.dragY;

    cubeMotion.currentX += (targetX - cubeMotion.currentX) * 0.1;
    cubeMotion.currentY += (targetY - cubeMotion.currentY) * 0.1;

    wireCube.style.setProperty('--cube-rotate-x', `${cubeMotion.currentX.toFixed(2)}deg`);
    wireCube.style.setProperty('--cube-rotate-y', `${cubeMotion.currentY.toFixed(2)}deg`);
    wireCube.style.setProperty('--cube-rotate-z', '1deg');

    window.requestAnimationFrame(animateCube);
  };

  heroVisual.addEventListener('pointerenter', (e) => {
    cubeMotion.isHovering = true;
    updateHoverRotation(e.clientX, e.clientY);
  });

  heroVisual.addEventListener('pointermove', (e) => {
    if (cubeMotion.isDragging) {
      const deltaX = e.clientX - cubeMotion.lastX;
      const deltaY = e.clientY - cubeMotion.lastY;

      cubeMotion.dragY += deltaX * 0.32;
      cubeMotion.dragX = clamp(cubeMotion.dragX - deltaY * 0.24, -28, 28);
      cubeMotion.lastX = e.clientX;
      cubeMotion.lastY = e.clientY;
    }

    cubeMotion.isHovering = true;
    updateHoverRotation(e.clientX, e.clientY);
  });

  heroVisual.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    cubeMotion.isDragging = true;
    cubeMotion.lastX = e.clientX;
    cubeMotion.lastY = e.clientY;
    heroVisual.classList.add('is-dragging');
    heroVisual.setPointerCapture(e.pointerId);
  });

  const endCubeDrag = (e) => {
    cubeMotion.isDragging = false;
    cubeMotion.isHovering = e.pointerType === 'mouse' && heroVisual.matches(':hover');
    heroVisual.classList.remove('is-dragging');

    if (!cubeMotion.isHovering) {
      cubeMotion.targetHoverX = 0;
      cubeMotion.targetHoverY = 0;
    }

    if (heroVisual.hasPointerCapture(e.pointerId)) {
      heroVisual.releasePointerCapture(e.pointerId);
    }
  };

  heroVisual.addEventListener('pointerup', endCubeDrag);
  heroVisual.addEventListener('pointercancel', endCubeDrag);

  heroVisual.addEventListener('pointerleave', () => {
    if (!cubeMotion.isDragging) {
      cubeMotion.isHovering = false;
      cubeMotion.targetHoverX = 0;
      cubeMotion.targetHoverY = 0;
    }
  });

  window.requestAnimationFrame(animateCube);
}

document.querySelectorAll('.email-copy').forEach(el => {
  el.style.cursor = 'pointer';
  el.title = 'Click to copy email';

  el.addEventListener('click', () => {
    const email = el.dataset.email || el.textContent.trim();

    navigator.clipboard.writeText(email).then(() => {
      const original = el.innerHTML;
      el.innerHTML = '<i class="fa fa-check icon"></i>Copied!';
      el.style.color = 'var(--accent)';

      setTimeout(() => {
        el.innerHTML = original;
        el.style.color = '';
      }, 2000);
    });
  });
});

const typingEl = document.querySelector('.typing');

if (typingEl) {
  typingEl.setAttribute('data-text', typingEl.textContent);
}

if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
