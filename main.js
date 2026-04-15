// =============================
// MENU MOBILE
// =============================
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =============================
// REVEAL ON SCROLL
// =============================
const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((item) => revealObserver.observe(item));

// =============================
// FORM VALIDATION
// =============================
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message) {
      formStatus.textContent =
        "Completá nombre, email y mensaje para enviar la consulta.";
      return;
    }

    if (!isValidEmail) {
      formStatus.textContent = "Ingresá un email válido para continuar.";
      return;
    }

    formStatus.textContent =
      "Gracias por tu consulta. Nuestro equipo te contactará para evaluar tu operación.";
    form.reset();
  });
}

// =============================
// SNOW FX (HOVER EFFECT)
// =============================
const snowFxSelectors = [
  ".card",
  ".feature",
  ".trust-card",
  ".contact-map-card",
];

const snowFxCards = document.querySelectorAll(snowFxSelectors.join(", "));

snowFxCards.forEach((card) => {
  card.classList.add("snow-fx-card");

  let icon = card.querySelector(".snow-fx");
  if (!icon) {
    icon = document.createElement("span");
    icon.className = "snow-fx";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "❄";
    card.appendChild(icon);
  }

  card.addEventListener("mouseenter", () => {
    card.classList.add("is-hovered");
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("is-hovered");
  });

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });
});

// =============================
// CUSTOM SELECT
// =============================
const serviceSelect = document.getElementById("serviceSelect");

if (serviceSelect) {
  const trigger = serviceSelect.querySelector(".custom-select__trigger");
  const valueText = serviceSelect.querySelector(".custom-select__value");
  const options = serviceSelect.querySelectorAll(".custom-select__option");
  const hiddenInput = document.getElementById("service");

  const closeSelect = () => {
    serviceSelect.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", () => {
    const isOpen = serviceSelect.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((opt) => opt.classList.remove("is-selected"));
      option.classList.add("is-selected");

      const value = option.dataset.value || "";
      valueText.textContent = option.textContent.trim();
      hiddenInput.value = value;

      closeSelect();
    });
  });

  document.addEventListener("click", (e) => {
    if (!serviceSelect.contains(e.target)) {
      closeSelect();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSelect();
    }
  });
}

// =============================
// MODAL ANIVERSARIO
// =============================
const anniversaryModal = document.getElementById("anniversaryModal");
const anniversaryClose = document.getElementById("closeModal");
const anniversaryCloseBtn = document.getElementById("closeModalBtn");

if (anniversaryModal && !localStorage.getItem("ceaAnniversaryModalSeen")) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      anniversaryModal.classList.add("is-active");
      localStorage.setItem("ceaAnniversaryModalSeen", "true");
    }, 700);
  });
}

if (anniversaryClose) {
  anniversaryClose.addEventListener("click", () => {
    anniversaryModal.classList.remove("is-active");
  });
}

if (anniversaryCloseBtn) {
  anniversaryCloseBtn.addEventListener("click", () => {
    anniversaryModal.classList.remove("is-active");
  });
}

if (anniversaryModal) {
  anniversaryModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("anniversary-modal__overlay")) {
      anniversaryModal.classList.remove("is-active");
    }
  });
}