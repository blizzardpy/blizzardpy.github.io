const commandResponses = {
  whoami: {
    output: 'Senior Software Engineer focused on scalable backend systems, APIs, data flows, and production reliability.',
    target: '#about',
  },
  stack: {
    output: 'Python, Go, Django, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, Odoo, React, SwiftUI, Flutter, and AI tooling.',
    target: '#skills',
  },
  projects: {
    output: 'Opening service registry: streaming, media, social, travel, gaming, education, and publishing platforms.',
    target: '#projects',
  },
  contact: {
    output: 'Opening connection channel. Resume, GitHub, LinkedIn, and email are ready.',
    target: '#contact',
  },
};

const events = [
  'api gateway routed profile request',
  'stack map indexed backend modules',
  'service registry refreshed project metadata',
  'timeline deployment history synchronized',
  'contact channel health check passed',
  'resume endpoint ready for download',
];

const metricValues = {
  latency: ['38', '42', '45', '41', '39'],
  uptime: ['99.9', '99.8', '99.9', '100'],
  throughput: ['18k', '21k', '19k', '24k'],
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function setupCommands() {
  const output = document.getElementById('commandOutput');
  document.querySelectorAll('[data-command]').forEach((button) => {
    button.addEventListener('click', () => {
      const response = commandResponses[button.dataset.command];
      if (!response) {
        return;
      }
      output.textContent = response.output;
      scrollToTarget(response.target);
    });
  });
}

function setupEventLog() {
  if (prefersReducedMotion) {
    return;
  }

  const log = document.getElementById('eventLog');
  if (!log) {
    return;
  }

  let index = 0;
  window.setInterval(() => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entry = document.createElement('p');
    entry.innerHTML = `<span>${timestamp}</span>${events[index % events.length]}`;
    log.prepend(entry);
    while (log.children.length > 4) {
      log.lastElementChild.remove();
    }
    index += 1;
  }, 3200);
}

function setupMetrics() {
  if (prefersReducedMotion) {
    return;
  }

  let tick = 0;
  window.setInterval(() => {
    Object.entries(metricValues).forEach(([name, values]) => {
      const element = document.querySelector(`[data-metric-value="${name}"]`);
      if (element) {
        element.textContent = values[tick % values.length];
      }
    });
    tick += 1;
  }, 2400);
}

function setupScrollReveal() {
  const sections = document.querySelectorAll('.section-observed');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  sections.forEach((section) => observer.observe(section));
}

function setupActiveNavigation() {
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -50% 0px', threshold: 0.01 });

  sections.forEach((section) => observer.observe(section));
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      return;
    }

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:amirkiankiani@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
}

function setupScrollTop() {
  const button = document.getElementById('scrollTop');
  if (!button) {
    return;
  }

  window.addEventListener('scroll', () => {
    button.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToTarget(link.getAttribute('href'));
    });
  });
}

setupCommands();
setupEventLog();
setupMetrics();
setupScrollReveal();
setupActiveNavigation();
setupContactForm();
setupScrollTop();
setupAnchorLinks();
