// =============================
// AÑOS DE TRAYECTORIA Y BARRA DE ANIVERSARIO
// =============================
const FOUNDING_YEAR = 2003;
const currentYear = new Date().getFullYear();

document.querySelectorAll("[data-years]").forEach((el) => {
  el.textContent = `${currentYear - FOUNDING_YEAR} años`;
});

// Se guarda el año: la barra vuelve a aparecer con el aniversario siguiente.
document.getElementById("anniversaryClose")?.addEventListener("click", () => {
  document.documentElement.classList.add("anniv-off");
  try {
    localStorage.setItem("ceaAnniversaryBar", String(currentYear));
  } catch (error) {
    // Sin almacenamiento la barra solo queda cerrada en esta visita.
  }
});

// =============================
// MENU MOBILE
// =============================
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

if (menuToggle && siteNav) {
  const setMenu = (isOpen) => {
    siteNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  };

  menuToggle.addEventListener("click", () => {
    setMenu(!siteNav.classList.contains("is-open"));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
      setMenu(false);
      menuToggle.focus();
    }
  });
}

// =============================
// REVEAL ON SCROLL
// =============================
const reveals = document.querySelectorAll(".reveal");

if (reveals.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
  );

  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

// =============================
// NAV: SECCIÓN ACTUAL
// =============================
const navLinks = siteNav ? [...siteNav.querySelectorAll('a[href^="#"]')] : [];

if (navLinks.length && "IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) navObserver.observe(section);
  });
}

// =============================
// SNOW FX (CURSOR CONGELADO)
// =============================
// Un solo elemento fijo sigue al mouse. Sobre links, botones y campos se
// oculta para que vuelva el cursor normal. El formulario queda fuera a propósito.
const snowTargets = [
  ".proof__item",
  ".regime",
  ".service",
  ".why__media",
  ".claim",
  ".split__media",
  ".feature",
  ".trust",
  ".step",
  ".contact__info",
].join(", ");

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(snowTargets).forEach((el) => {
    el.classList.add("snow-target");
  });

  const snow = document.createElement("div");
  snow.className = "snow-cursor";
  snow.setAttribute("aria-hidden", "true");
  snow.innerHTML = "<span>❄︎</span>";
  document.body.appendChild(snow);

  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;

  const updateSnow = (target) => {
    const isActive =
      target instanceof Element &&
      target.closest(snowTargets) &&
      !target.closest("a, button, input, select, textarea, label");

    snow.classList.toggle("is-active", Boolean(isActive));
    if (isActive) {
      snow.classList.toggle("is-light", Boolean(target.closest(".section--light")));
    }
  };

  document.addEventListener("pointermove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    updateSnow(e.target);

    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        snow.style.transform = `translate(${pointerX}px, ${pointerY}px)`;
      });
    }
  });

  // Al scrollear con la rueda cambia lo que hay debajo sin que se mueva el mouse.
  window.addEventListener(
    "scroll",
    () => updateSnow(document.elementFromPoint(pointerX, pointerY)),
    { passive: true },
  );

  document.documentElement.addEventListener("pointerleave", () => {
    snow.classList.remove("is-active");
  });
}

// =============================
// FORMULARIO + FORMSPREE
// =============================
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const replyToInput = document.getElementById("replyto");

if (form && formStatus) {
  const setStatus = (text, state = "") => {
    formStatus.textContent = text;
    formStatus.dataset.state = state;
  };

  const markField = (field, isInvalid) => {
    if (isInvalid) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  };

  form.querySelectorAll("[required]").forEach((field) => {
    field.addEventListener("input", () => markField(field, false));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const submitButton = form.querySelector('button[type="submit"]');

    const email = emailField.value.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const invalid = [
      [nameField, !nameField.value.trim()],
      [emailField, !isValidEmail],
      [messageField, !messageField.value.trim()],
    ];
    invalid.forEach(([field, bad]) => markField(field, bad));

    const firstInvalid = invalid.find(([, bad]) => bad);
    if (firstInvalid) {
      setStatus(
        email && !isValidEmail && firstInvalid[0] === emailField
          ? "Ingresá un email válido para continuar."
          : "Completá nombre, email y mensaje para enviar la consulta.",
        "error",
      );
      firstInvalid[0].focus();
      return;
    }

    if (replyToInput) {
      replyToInput.value = email;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    setStatus("Enviando consulta...");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus(
          "Gracias por tu consulta. Nuestro equipo te contactará para evaluar tu operación.",
          "success",
        );
        form.reset();
        if (replyToInput) {
          replyToInput.value = "";
        }
      } else {
        const data = await response.json().catch(() => null);
        setStatus(
          data?.errors?.length
            ? data.errors.map((error) => error.message).join(", ")
            : "No pudimos enviar la consulta. Probá nuevamente en unos minutos.",
          "error",
        );
      }
    } catch (error) {
      setStatus("Ocurrió un problema de conexión. Intentá nuevamente.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar consulta";
    }
  });
}
