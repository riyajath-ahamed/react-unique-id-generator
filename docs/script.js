document.addEventListener('DOMContentLoaded', () => {
  // --- Tabs ---
  document.querySelectorAll('.tabs').forEach((tabContainer) => {
    const buttons = tabContainer.querySelectorAll('.tab-btn');
    const panels = tabContainer.querySelectorAll('.tab-panel');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        tabContainer
          .querySelector(`[data-panel="${target}"]`)
          .classList.add('active');
      });
    });
  });

  // --- Copy to clipboard ---
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const svg = btn.innerHTML;
        btn.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = svg;
        }, 2000);
      });
    });
  });

  // --- Nav scroll effect ---
  const nav = document.getElementById('nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Mobile nav toggle ---
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', targetId);
      }
    });
  });

  // --- Intersection Observer for fade-in ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.feature-card, .example-card, .framework-card, .migration-step, .whats-new-card, .api-entry, .faq-item').forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // --- Active nav link ---
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
});
