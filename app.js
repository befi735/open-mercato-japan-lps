window.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll(".spec-tab"));
  const panels = Array.from(document.querySelectorAll(".spec-panel"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === id);
      });
    });
  });

  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!window.gsap || reduced) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    revealTargets.forEach((el) => {
      el.style.transition = "opacity 620ms ease, transform 620ms ease";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    revealTargets.forEach((el) => observer.observe(el));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".site-header", { opacity: 0, y: -18, duration: 0.58 })
    .to(".hero [data-reveal]", { opacity: 1, y: 0, duration: 0.78, stagger: 0.12 }, "-=0.2")
    .from(".phone-light", { opacity: 0, y: 34, rotate: -2, duration: 0.78 }, "-=0.55")
    .from(".phone-dark", { opacity: 0, y: 48, rotate: 2, duration: 0.82 }, "-=0.62")
    .from(".sync-card", { opacity: 0, scale: 0.94, duration: 0.62 }, "-=0.44");

  gsap.to(".phone-light", {
    y: -18,
    scrollTrigger: {
      trigger: ".device-stage",
      start: "top 20%",
      end: "bottom top",
      scrub: 1.1
    }
  });

  gsap.to(".phone-dark", {
    y: -34,
    scrollTrigger: {
      trigger: ".device-stage",
      start: "top 20%",
      end: "bottom top",
      scrub: 1.1
    }
  });

  revealTargets
    .filter((el) => !el.closest(".hero"))
    .forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          once: true
        }
      });
    });
});
