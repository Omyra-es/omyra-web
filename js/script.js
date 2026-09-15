const header = document.querySelector(".header");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const revealItems = document.querySelectorAll("[data-reveal]");
const faqItems = document.querySelectorAll(".faq details");

function closeMenu() {
  if (!menuButton || !mobileMenu) return;

  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("open");
  header?.classList.remove("menu-visible");
  document.body.classList.remove("menu-open");
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("open", !isOpen);
    header?.classList.toggle("menu-visible", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeMenu();
  });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("reveal-ready");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px" });

  revealItems.forEach((item) => revealObserver.observe(item));
}

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const demoPanel = document.querySelector(".demo-panel");
const demoTriggers = document.querySelectorAll("[data-demo-trigger]");
const demoCloseButtons = document.querySelectorAll("[data-demo-close]");
const demoForm = document.getElementById("demo-request-form");
const demoFormError = document.getElementById("demo-form-error");
const demoFormSuccess = document.getElementById("demo-form-success");

let lastDemoTrigger = null;

function openDemoPanel(trigger) {
  if (!demoPanel) return;

  lastDemoTrigger = trigger ?? document.activeElement;

  closeMenu();

  demoPanel.classList.add("is-open");
  demoPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("demo-open");

  window.setTimeout(() => {
    document.getElementById("demo-name")?.focus();
  }, 260);
}

function closeDemoPanel() {
  if (!demoPanel) return;

  demoPanel.classList.remove("is-open");
  demoPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("demo-open");

  if (demoForm && demoFormSuccess) {
    demoForm.reset();

    demoForm.hidden = false;
    demoFormSuccess.hidden = true;

    demoFormError.hidden = true;
    demoFormError.textContent = "";

    demoForm
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((field) => field.removeAttribute("aria-invalid"));
  }

  lastDemoTrigger?.focus?.();
}

demoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openDemoPanel(trigger);
  });
});

demoCloseButtons.forEach((button) => {
  button.addEventListener("click", closeDemoPanel);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && demoPanel?.classList.contains("is-open")) {
    closeDemoPanel();
  }
});

if (demoForm) {
  demoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!demoFormError || !demoFormSuccess) return;

    demoFormError.hidden = true;
    demoFormError.textContent = "";

    const formData = new FormData(demoForm);
    const isFounderRequest = demoForm.dataset.requestKind === "founders";
    const userContext = String(formData.get("context") || "").trim();

    const payload = {
      name: String(formData.get("name") || "").trim(),
      businessName: String(formData.get("businessName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      context: isFounderRequest
        ? `Solicitud para el programa de negocios fundadores.${userContext ? `\n\n${userContext}` : ""}`
        : userContext,
      website: String(formData.get("website") || "").trim(),
    };
    demoForm
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((field) => field.removeAttribute("aria-invalid"));

    if (!payload.name) {
      showDemoError(
        "Indica tu nombre.",
        "demo-name"
      );
      return;
    }

    if (!payload.businessName) {
      showDemoError(
        "Indica el nombre de tu negocio.",
        "demo-business"
      );
      return;
    }

    if (!payload.phone && !payload.email) {
      showDemoError(
        "Indica al menos un teléfono o un email para poder contactarte."
      );
      return;
    }

    if (payload.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(payload.email)) {
        showDemoError(
          "Introduce una dirección de email válida.",
          "demo-email"
        );
        return;
      }
    }

    if (payload.phone) {
      const normalizedPhone = payload.phone.replace(/[\s().-]/g, "");

      const phonePattern = /^\+?[0-9]{7,15}$/;

      if (!phonePattern.test(normalizedPhone)) {
        showDemoError(
          "Introduce un número de teléfono válido.",
          "demo-phone"
        );
        return;
      }
    }

    const submitButton = demoForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando…";
    }

    try {
      const response = await fetch(
        "https://clientes.omyra.es/api/public/demo-requests",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 422) {
          showDemoError(
            "Hay algún dato incorrecto en el formulario. Revísalo e inténtalo de nuevo."
          );
          return;
        }

        throw new Error(`HTTP ${response.status}`);
      }

      demoForm.hidden = true;
      demoFormSuccess.hidden = false;
    } catch (error) {
      console.error("Demo request failed", error);

      demoFormError.textContent =
        "No hemos podido enviar la solicitud. Inténtalo de nuevo en unos instantes.";
      demoFormError.hidden = false;
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML =
          `${isFounderRequest ? "Enviar solicitud" : "Solicitar demo"} <span aria-hidden="true">→</span>`;
      }
    }
  });

  function showDemoError(message, fieldId = null) {
    if (!demoFormError) return;

    demoFormError.textContent = message;
    demoFormError.hidden = false;

    if (fieldId) {
      const field = document.getElementById(fieldId);

      if (field) {
        field.setAttribute("aria-invalid", "true");
        field.focus();
      }
    }
  }
}
