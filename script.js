/* =========================================================
   Amirkian Kiani — "Aurora" portfolio interactions
   Scroll reveal · count-up · parallax · cursor glow · nav
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector("[data-header]");
  const scrollTopBtn = document.querySelector("[data-scroll-top]");

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (scrollTopBtn) scrollTopBtn.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced || isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !prefersReduced) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObs.observe(el));
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Mouse parallax (aurora + hero card) ---------- */
  if (finePointer && !prefersReduced) {
    const aurora = document.querySelector("[data-aurora]");
    const tiltCard = document.querySelector("[data-tilt]");
    const cursor = document.querySelector("[data-cursor]");

    let raf = null;
    let mx = 0, my = 0;

    const apply = () => {
      const cx = (mx / window.innerWidth - 0.5);
      const cy = (my / window.innerHeight - 0.5);
      if (aurora) aurora.style.transform = `translate3d(${cx * -26}px, ${cy * -26}px, 0)`;
      if (tiltCard) tiltCard.style.transform = `perspective(900px) rotateY(${cx * 5}deg) rotateX(${cy * -5}deg) translateZ(0)`;
      raf = null;
    };

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        cursor.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      if (cursor) cursor.style.opacity = "0";
      if (tiltCard) tiltCard.style.transform = "";
      if (aurora) aurora.style.transform = "";
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll("[data-nav-links] a");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const byId = {};
    navAnchors.forEach((a) => { byId[a.getAttribute("href")] = a; });
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.style.color = "");
            const active = byId["#" + entry.target.id];
            if (active) active.style.color = "var(--ink)";
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
