document.querySelectorAll(".portfolio-section").forEach((section) => {
  const carousel = section.querySelector("[data-carousel]");

  if (!carousel) {
    return;
  }

  const getScrollAmount = () => {
    const card = carousel.querySelector(".project-card");
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap);
    return card.getBoundingClientRect().width + gap;
  };

  section.querySelector("[data-carousel-prev]").addEventListener("click", () => {
    carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  section.querySelector("[data-carousel-next]").addEventListener("click", () => {
    carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
});
