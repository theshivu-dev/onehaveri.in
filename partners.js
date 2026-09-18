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
   - Match the source artwork ratio so the banner fills its width without
     side gutters or cropping.
   - Center and emphasize the Coming soon status badge.
   - Remove the obsolete decorative wave between hero and posts.
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
      aspect-ratio: 16 / 9 !important;
      max-height: none !important;
      min-height: 0 !important;
      overflow: hidden;
    }

    .hero::before {
      animation: none !important;
      background-image: url("${desktopBanner}") !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-size: cover !important;
    }

    .hero > .status {
      top: 14px !important;
      left: 50% !important;
      right: auto !important;
      transform: translateX(-50%) !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      padding: 9px 18px !important;
      margin: 0 !important;
      border: 1px solid rgba(156,74,46,.24) !important;
      border-radius: 999px !important;
      background: rgba(248,241,227,.94) !important;
      color: var(--terracotta) !important;
      font-size: clamp(12px, 1.3vw, 15px) !important;
      font-weight: 700 !important;
      box-shadow: 0 0 0 4px rgba(248,241,227,.20), 0 5px 18px rgba(46,33,23,.16), 0 0 20px rgba(217,161,63,.24) !important;
      white-space: nowrap !important;
    }

    .hero > .status::before {
      content: "" !important;
      width: 9px !important;
      height: 9px !important;
      flex: 0 0 9px !important;
      border-radius: 50% !important;
      background: #D9A13F !important;
      box-shadow: 0 0 0 3px rgba(217,161,63,.18), 0 0 12px rgba(217,161,63,.75) !important;
      animation: onehaveriStatusGlow 1.8s ease-in-out infinite !important;
    }

    @keyframes onehaveriStatusGlow {
      0%, 100% { opacity: .75; transform: scale(.92); }
      50% { opacity: 1; transform: scale(1.12); }
    }

    .section-wave {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    @media (max-width: 600px) {
      .hero {
        aspect-ratio: 16 / 9 !important;
        max-height: none !important;
      }

      .hero::before {
        background-image: url("${mobileBanner}") !important;
      }

      .hero > .status {
        top: 10px !important;
        padding: 7px 13px !important;
        font-size: 12px !important;
      }

      .hero > .status::before {
        width: 7px !important;
        height: 7px !important;
        flex-basis: 7px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero::before,
      .hero > .status::before {
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
