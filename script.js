const darkToggleBtn = document.getElementById('dark-toggle');
const prefersDark = localStorage.getItem('theme') === 'dark';

if (prefersDark) document.body.classList.add('dark-mode');

if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    darkToggleBtn.innerHTML = isDark
      ? '<i class="fa fa-sun-o"></i>'
      : '<i class="fa fa-moon-o"></i>';
  });

  if (prefersDark) darkToggleBtn.innerHTML = '<i class="fa fa-sun-o"></i>';
}

const fadeEls = document.querySelectorAll('.card, .achievement-item');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

const skillFills = document.querySelectorAll('.skill-fill, .lang-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.style.width;
      el.style.width = '0';
      el.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.width = target;
        });
      });
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(el => skillObserver.observe(el));

const backBtn = document.getElementById('back-to-top');

if (backBtn) {
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('show', window.scrollY > 400);
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

document.querySelectorAll('.content-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * 3;
    const rotY = ((x - cx) / cx) * -3;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('.email-copy').forEach(el => {
  el.style.cursor = 'pointer';
  el.title = 'Click to copy email';

  el.addEventListener('click', () => {
    const email = el.dataset.email || el.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      const original = el.innerHTML;
      el.innerHTML = '<i class="fa fa-check icon"></i>Copied!';
      el.style.color = '#009688';
      setTimeout(() => {
        el.innerHTML = original;
        el.style.color = '';
      }, 2000);
    });
  });
});

const typingEl = document.querySelector('.typing');
if (typingEl) {
  const text = typingEl.textContent;
  typingEl.setAttribute('data-text', text);
}

let lastScroll = 0;
const nav = document.querySelector('.top-nav');

if (nav) {
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  });
}