import LiquidBackground from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js";

let liquidApp;
let rainEnabled = false;
const testimonials = [
  {
    quote:
      "The shader controls made design reviews feel like live music mixing.",
    name: "Riha Patel",
    role: "Design Lead · HoloSound",
  },
  {
    quote:
      "Engineering hands-offs now ship with zero guesswork thanks to the process map.",
    name: "Evan Brooks",
    role: "Sr. Engineer · Nebula XR",
  },
  {
    quote: "We turned the liquid hero into a shareable case study overnight.",
    name: "Sasha Ortiz",
    role: "Creative Strategist · Pulse",
  },
];
let testimonialIndex = 0;

window.addEventListener("DOMContentLoaded", () => {
  initLiquidSurface();
  initScrollMeta();
  initRevealAnimations();
  initTestimonials();
  initToolkitAccordion();
});

function initLiquidSurface() {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  liquidApp = LiquidBackground(canvas);
  liquidApp.loadImage("https://assets.codepen.io/33787/liquid.webp");
  liquidApp.liquidPlane.material.metalness = 0.75;
  liquidApp.liquidPlane.material.roughness = 0.25;
  liquidApp.liquidPlane.uniforms.displacementScale.value = 5;
  liquidApp.setRain(false);

  bindShaderControls();
}

function bindShaderControls() {
  const depthSlider = document.getElementById("depthSlider");
  const depthDisplay = document.getElementById("depthDisplay");
  const depthValue = document.getElementById("depthValue");
  const rainToggle = document.getElementById("rainToggle");

  if (depthSlider) {
    const syncDepth = (value) => {
      const formatted = value.toFixed(1);
      if (depthDisplay) depthDisplay.textContent = formatted;
      if (depthValue) depthValue.textContent = formatted;
      if (liquidApp) {
        liquidApp.liquidPlane.uniforms.displacementScale.value = value;
      }
    };

    syncDepth(parseFloat(depthSlider.value));

    depthSlider.addEventListener("input", (event) => {
      syncDepth(parseFloat(event.target.value));
    });
  }

  if (rainToggle) {
    rainToggle.addEventListener("click", () => {
      rainEnabled = !rainEnabled;
      rainToggle.textContent = `Rain: ${rainEnabled ? "On" : "Off"}`;
      if (liquidApp) {
        liquidApp.setRain(rainEnabled);
      }
    });
  }
}

function initScrollMeta() {
  const progressThumb = document.querySelector(".progress-thumb");
  const navLinks = document.querySelectorAll(".site-nav a");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if (!progressThumb || !sections.length) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateMeta = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressThumb.style.transform = `scaleX(${clamp(ratio, 0, 1)})`;

    const targetLine = window.innerHeight * 0.35;
    let activeId = sections[0].id;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= targetLine && rect.bottom >= targetLine) {
        activeId = section.id;
        break;
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const id = href.startsWith("#") ? href.slice(1) : "";
      if (id && id === activeId) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  };

  updateMeta();
  window.addEventListener("scroll", updateMeta, { passive: true });
  window.addEventListener("resize", updateMeta);
}

function initRevealAnimations() {
  const observed = document.querySelectorAll(".observe");
  if (!observed.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observed.forEach((el) => observer.observe(el));
}

function initTestimonials() {
  const panel = document.getElementById("testimonialPanel");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  if (!panel || !prevBtn || !nextBtn) return;

  const quoteEl = panel.querySelector(".testimonial-quote");
  const metaEl = panel.querySelector(".testimonial-meta");

  const render = () => {
    const entry = testimonials[testimonialIndex];
    if (!entry) return;
    if (quoteEl) quoteEl.textContent = `“${entry.quote}”`;
    if (metaEl) {
      metaEl.innerHTML = `<strong>${entry.name}</strong><span>${entry.role}</span>`;
    }
  };

  const shift = (direction) => {
    testimonialIndex =
      (testimonialIndex + direction + testimonials.length) %
      testimonials.length;
    panel.classList.remove("is-visible");
    void panel.offsetWidth;
    panel.classList.add("is-visible");
    render();
  };

  prevBtn.addEventListener("click", () => shift(-1));
  nextBtn.addEventListener("click", () => shift(1));
  render();
}

function initToolkitAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) return;

  const closeOthers = (active) => {
    triggers.forEach((trigger) => {
      if (trigger === active) return;
      trigger.setAttribute("aria-expanded", "false");
    });
  };

  triggers.forEach((trigger, index) => {
    if (!trigger.hasAttribute("aria-expanded")) {
      trigger.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    }

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
      } else {
        trigger.setAttribute("aria-expanded", "true");
        closeOthers(trigger);
      }
    });
  });
}
