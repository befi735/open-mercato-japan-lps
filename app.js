window.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap) {
    const animated = document.querySelectorAll("[data-animate]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      animated.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    animated.forEach((el) => {
      el.style.transition = "opacity 620ms ease, transform 620ms ease";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    animated.forEach((el) => observer.observe(el));

    const phone = document.querySelector(".phone");
    if (phone) {
      phone.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-10px)" },
          { transform: "translateY(0)" }
        ],
        { duration: 4200, iterations: Infinity, easing: "ease-in-out" }
      );
    }
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  if (reduced) {
    gsap.set("[data-animate]", { opacity: 1, y: 0 });
    return;
  }

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".nav", { opacity: 0, y: -18, duration: 0.55 })
    .to(".hero [data-animate]", { opacity: 1, y: 0, duration: 0.72, stagger: 0.08 }, "-=0.18")
    .from(".phone", { opacity: 0, y: 44, rotateY: -8, duration: 0.9 }, "-=0.46")
    .from(".floating-note", { opacity: 0, y: 24, duration: 0.62 }, "-=0.5");

  gsap.to(".phone", {
    y: -18,
    rotateY: 4,
    scrollTrigger: {
      trigger: ".phone-stage",
      start: "top 20%",
      end: "bottom top",
      scrub: 1.1
    }
  });

  gsap.utils.toArray("section:not(.hero) [data-animate], .footer [data-animate]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.68,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
        once: true
      }
    });
  });
});
