/* ==========================================================================
   PARTNER DATA & RENDERER
   ========================================================================== */

const PARTNERS_DATA = {
  // PARTNER 1: NammaShale
  "nammashale": {
    brandText: "Namma",
    brandHighlight: "ಶಾಲೆ",
    badge: "ಉಪಯುಕ್ತ ಇನಿಶಿಯೇಟಿವ್",
    title: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಶಾಲೆಗಳ ನಕ್ಷೆ",
    description: "ಕರ್ನಾಟಕದ ಸರ್ಕಾರಿ ಶಾಲೆಗಳ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಸಮಸ್ಯೆಗಳನ್ನು ತಿಳಿಯಲು ಹಾಗೂ ಸಾರ್ವಜನಿಕವಾಗಿ ವರದಿ ಮಾಡಲು ರೂಪಿಸಲಾದ ನಕ್ಷೆ.",
    linkUrl: "https://nammashale.in",
    themeClass: "partner-1-nammashale"
  }
  
  /* PARTNER 2: ADD FUTURE PARTNERS HERE
  , "future-id": {
    brandText: "Future",
    brandHighlight: "Initiative",
    badge: "ವಿವರಣೆ",
    title: "ಶೀರ್ಷಿಕೆ",
    description: "ವಿವರಣೆ...",
    linkUrl: "https://example.com",
    themeClass: "partner-2-future"
  }
  */
};

/* ==========================================================================
   SHARED HOME HERO BANNER
   --------------------------------------------------------------------------
   index.html and home_ip.html both load this file.

   Behaviour:
   - Pick exactly one of banner1.png / banner2.png / banner3.png on page load.
   - Keep that banner fixed for the lifetime of the current page load.
   - Disable the old CSS keyframe rotation.
   - Keep the hero visually compact like a normal website banner/header.
   ========================================================================== */

function initHeroBanner() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const banners = ["banner1.png", "banner2.png", "banner3.png"];
  const selectedBanner = banners[Math.floor(Math.random() * banners.length)];

  const style = document.createElement("style");
  style.id = "onehaveri-hero-runtime-style";
  style.textContent = `
    .hero {
      width: 100%;
      aspect-ratio: 3.2 / 1 !important;
      max-height: 360px !important;
      min-height: 0 !important;
      overflow: hidden;
    }

    .hero::before {
      animation: none !important;
      background-image: url("${selectedBanner}") !important;
    }

    @media (max-width: 600px) {
      .hero {
        aspect-ratio: 2.35 / 1 !important;
        max-height: 220px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero::before {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);
  hero.dataset.banner = selectedBanner;
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroBanner();
  renderPartnerInitiatives();
});

function renderPartnerInitiatives() {
  const partnerContainers = document.querySelectorAll("[data-partner]");

  partnerContainers.forEach((container) => {
    const partnerKey = container.getAttribute("data-partner");
    const data = PARTNERS_DATA[partnerKey];

    if (!data) return;

    // Build markup entirely in JS
    container.className = `partner-card ${data.themeClass}`;
    container.innerHTML = `
      <div class="partner-card-header">
        <a href="${data.linkUrl}" target="_blank" rel="noopener noreferrer" class="partner-brand partner-brand-link" aria-label="${data.brandText} ${data.brandHighlight}">
          <span class="partner-brand-text">${data.brandText}</span>
          <span class="partner-brand-highlight">${data.brandHighlight}</span>
        </a>
        <span class="partner-badge">${data.badge}</span>
      </div>

      <div class="partner-card-body">
        <h3 class="partner-title">${data.title}</h3>
        <p class="partner-description">${data.description}</p>
      </div>
    `;
  });
}
