// Site institucional estático - base validada a partir dos cases Infra&Wifi/PegadaPro

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navMenu && navbar) {
    navToggle.addEventListener('click', function(event) {
      event.stopPropagation();
      nav.classList.toggle('nav-open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navbar.classList.remove('nav-open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(event) {
      if (!navbar.contains(event.target) && navbar.classList.contains('nav-open')) {
        navbar.classList.remove('nav-open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        navbar.classList.remove('nav-open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(event) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  window.addEventListener('scroll', function() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
});
