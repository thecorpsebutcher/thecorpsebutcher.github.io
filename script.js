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

document.querySelectorAll(".project-art[data-trailer-id]").forEach((art) => {
  const trailer = art.querySelector(".project-trailer");
  const trailerId = art.dataset.trailerId;

  const startPreview = () => {
    if (trailer.hasAttribute("src")) {
      return;
    }

    trailer.src = `https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0`;
    art.classList.add("is-playing");
  };

  const stopPreview = () => {
    trailer.removeAttribute("src");
    art.classList.remove("is-playing");
  };

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    art.addEventListener("mouseenter", startPreview);
    art.addEventListener("mouseleave", () => {
      if (!art.matches(":focus-within")) {
        stopPreview();
      }
    });
  }

  art.addEventListener("focusin", startPreview);
  art.addEventListener("focusout", (event) => {
    if (!art.contains(event.relatedTarget) && !art.matches(":hover")) {
      stopPreview();
    }
  });
});

const lightbox = document.querySelector(".image-lightbox");
const lightboxImage = lightbox.querySelector("img");

document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.closest(".gallery-piece").querySelector("span").textContent;
    lightbox.showModal();
  });
});

lightboxImage.addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

const languageToggle = document.querySelector("[data-language-toggle]");
const titleElement = document.querySelector("title");
const spanishTitle = titleElement.textContent;
const spanishText = new Map(
  [...document.querySelectorAll("[data-en]")].map((element) => [element, element.textContent])
);
const translatedAttributes = [
  {
    attribute: "aria-label",
    selector: "[data-en-aria-label]",
    dataKey: "enAriaLabel",
  },
  {
    attribute: "alt",
    selector: "[data-en-alt]",
    dataKey: "enAlt",
  },
  {
    attribute: "title",
    selector: "iframe[data-en-title]",
    dataKey: "enTitle",
  },
  {
    attribute: "href",
    selector: "[data-en-href]",
    dataKey: "enHref",
  },
  {
    attribute: "content",
    selector: "[data-en-content]",
    dataKey: "enContent",
  },
].map((translation) => ({
  ...translation,
  originals: new Map(
    [...document.querySelectorAll(translation.selector)].map((element) => [
      element,
      element.getAttribute(translation.attribute),
    ])
  ),
}));

let currentLanguage = document.documentElement.lang === "en" ? "en" : "es";

const setLanguage = (language) => {
  const isEnglish = language === "en";

  document.documentElement.lang = language;
  spanishText.forEach((spanish, element) => {
    element.textContent = isEnglish ? element.dataset.en : spanish;
  });
  translatedAttributes.forEach(({ attribute, dataKey, originals }) => {
    originals.forEach((spanish, element) => {
      element.setAttribute(attribute, isEnglish ? element.dataset[dataKey] : spanish);
    });
  });
  document.title = isEnglish ? titleElement.dataset.enTitle : spanishTitle;
  languageToggle.setAttribute("aria-label", isEnglish ? "Switch language to Spanish" : "Cambiar idioma a inglés");
  languageToggle.setAttribute("aria-pressed", String(isEnglish));
  languageToggle.querySelectorAll("[data-language-option]").forEach((option) => {
    option.classList.toggle("is-current", option.dataset.languageOption === language);
  });
  currentLanguage = language;
};

languageToggle.addEventListener("click", () => {
  setLanguage(currentLanguage === "es" ? "en" : "es");
});

setLanguage(currentLanguage);
