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

if (reveals.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  reveals.forEach((item) => revealObserver.observe(item));
}

// =============================
// SNOW FX (HOVER EFFECT)
// =============================
const snowFxSelectors = [
  ".hero__panel",

  ".card",
  ".media-card",
  ".feature",
  ".coverage-card",
  ".trust-card",
  ".process__step",
  ".cta-band",
  ".contact-map-card",
  ".contact-card",
  ".form-card",
  // ".footer__brand",
  // ".footer__col",
  ".anniversary-modal__content",
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
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  };

  if (trigger) {
    trigger.addEventListener("click", () => {
      const isOpen = serviceSelect.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((opt) => opt.classList.remove("is-selected"));
      option.classList.add("is-selected");

      const value = option.dataset.value || "";
      if (valueText) {
        valueText.textContent = option.textContent.trim();
      }
      if (hiddenInput) {
        hiddenInput.value = value;
      }

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
// FORMULARIO + FORMSPREE
// =============================
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const emailInput = document.getElementById("email");
const replyToInput = document.getElementById("replyto");

if (emailInput && replyToInput) {
  emailInput.addEventListener("input", (e) => {
    replyToInput.value = e.target.value.trim();
  });
}

if (form && formStatus) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";
    const submitButton = form.querySelector('button[type="submit"]');

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

    if (replyToInput) {
      replyToInput.value = email;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    formStatus.textContent = "Enviando consulta...";

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formStatus.textContent =
          "Gracias por tu consulta. Nuestro equipo te contactará para evaluar tu operación.";
        form.reset();

        const serviceValue = document.querySelector(
          "#serviceSelect .custom-select__value",
        );
        const serviceOptions = document.querySelectorAll(
          "#serviceSelect .custom-select__option",
        );
        const hiddenService = document.getElementById("service");

        if (serviceValue) {
          serviceValue.textContent = "Seleccionar";
        }

        if (hiddenService) {
          hiddenService.value = "";
        }

        serviceOptions.forEach((opt, index) => {
          opt.classList.toggle("is-selected", index === 0);
        });

        if (replyToInput) {
          replyToInput.value = "";
        }
      } else {
        const data = await response.json().catch(() => null);

        if (data?.errors?.length) {
          formStatus.textContent = data.errors
            .map((error) => error.message)
            .join(", ");
        } else {
          formStatus.textContent =
            "No pudimos enviar la consulta. Probá nuevamente en unos minutos.";
        }
      }
    } catch (error) {
      formStatus.textContent =
        "Ocurrió un problema de conexión. Intentá nuevamente.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar consulta";
      }
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