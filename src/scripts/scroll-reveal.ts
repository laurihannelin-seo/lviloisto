export const setupScrollReveal = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const mediaSelector = [
    ".solution-feature__media", ".portfolio-section__image", ".contact-section__media",
    ".about-carousel", ".about-positioning-section__media", ".service-intro-layout__media",
    ".lvi-work-article__media", ".company-image", ".service-reference figure",
    '[data-reveal="media"]',
  ].join(",");
  const copySelector = [
    ".solution-feature__copy", ".portfolio-section__content", ".about-section__copy",
    ".lvi-work-article__section--split .lvi-work-article__copy",
    ".service-intro-layout .service-prose", '[data-reveal="copy"]',
  ].join(",");
  const elements = Array.from(document.querySelectorAll<HTMLElement>(`${mediaSelector},${copySelector}`));

  const reveal = (element: HTMLElement, immediate = false) => {
    if (immediate) element.classList.add("reveal-immediate");
    element.classList.remove("is-reveal-pending");
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) reveal(entry.target as HTMLElement);
    });
  }, { rootMargin: "0px 0px -32px 0px", threshold: 0.05 });

  // Only enhance off-screen content: initial views and no-JS pages stay visible.
  elements.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.dataset.reveal = element.matches(mediaSelector) ? "media" : "copy";
    element.classList.add("is-reveal-pending");
    observer.observe(element);
  });

  document.addEventListener("focusin", (event) => {
    if (!(event.target instanceof Element)) return;
    const pending = event.target.closest<HTMLElement>(".is-reveal-pending");
    if (pending) reveal(pending, true);
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) elements.forEach((element) => reveal(element, true));
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) elements.forEach((element) => reveal(element, true));
  });
};
