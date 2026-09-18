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
   - Pick exactly one banner family on page load.
   - Use optimized WebP artwork for desktop and mobile.
   - Keep the selected banner fixed for the lifetime of the page load.
   - Disable the old CSS keyframe rotation.
   - Use contain so the supplied artwork is never cropped.
   ========================================================================== */

function initHeroBanner() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const bannerNumber = Math.floor(Math.random() * 3) + 1;
  const desktopBanner = `assets/banners/banner${bannerNumber}-desktop.webp`;
  const mobileBanner = `assets/banners/banner${bannerNumber}-mobile.webp`;

  const style = document.createElement("style");
  style.id = "onehaveri-hero-runtime-style";
  style.textContent = `
    .hero {
      width: 100%;
      aspect-ratio: 8 / 3 !important;
      max-height: 360px !important;
      min-height: 0 !important;
      overflow: hidden;
    }

    .hero::before {
      animation: none !important;
      background-image: url("${desktopBanner}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: contain !important;
    }

    @media (max-width: 600px) {
      .hero {
        aspect-ratio: 8 / 3 !important;
        max-height: 220px !important;
      }

      .hero::before {
        background-image: url("${mobileBanner}") !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero::before {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);
  hero.dataset.banner = String(bannerNumber);
  hero.dataset.desktopBanner = desktopBanner;
  hero.dataset.mobileBanner = mobileBanner;
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
