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
   - Preserve the original artwork ratio (8:3) so the full artwork remains
     visible while the banner fills the available width.
   - Add a compact, layered OneHaveri identity badge at the top-left.
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
      background-size: cover !important;
    }

    .hero::after {
      display: none !important;
      content: none !important;
    }

    .onehaveri-hero-brand {
      position: absolute;
      top: clamp(12px, 2.1vw, 24px);
      left: clamp(12px, 2.1vw, 24px);
      z-index: 4;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      max-width: min(310px, 46%);
      padding: 8px 15px 8px 8px;
      border: 1px solid rgba(248,241,227,.72);
      border-radius: 999px;
      background: linear-gradient(110deg, rgba(248,241,227,.96), rgba(248,241,227,.78));
      box-shadow: 0 7px 22px rgba(46,33,23,.16), 0 0 0 4px rgba(248,241,227,.16), 0 0 24px rgba(217,161,63,.18);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: transform .22s ease, box-shadow .22s ease;
      pointer-events: auto;
    }

    .onehaveri-hero-brand:hover {
      transform: translateY(-2px) scale(1.015);
      box-shadow: 0 10px 28px rgba(46,33,23,.20), 0 0 0 5px rgba(248,241,227,.20), 0 0 30px rgba(217,161,63,.32);
    }

    .onehaveri-hero-brand-logo {
      width: clamp(58px, 7.2vw, 82px);
      height: clamp(58px, 7.2vw, 82px);
      flex: 0 0 auto;
      object-fit: contain;
      border-radius: 50%;
      background: rgba(248,241,227,.95);
      box-shadow: 0 0 0 2px rgba(255,255,255,.8), 0 3px 12px rgba(46,33,23,.16), 0 0 18px rgba(217,161,63,.25);
      transition: filter .22s ease, transform .22s ease;
    }

    .onehaveri-hero-brand:hover .onehaveri-hero-brand-logo {
      transform: rotate(-2deg);
      filter: drop-shadow(0 0 8px rgba(217,161,63,.65));
    }

    .onehaveri-hero-brand-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      line-height: 1.05;
      text-align: left;
    }

    .onehaveri-hero-brand-name {
      color: var(--olive);
      font-family: var(--font-ui);
      font-size: clamp(18px, 2.1vw, 27px);
      font-weight: 800;
      letter-spacing: -.7px;
      white-space: nowrap;
    }

    .onehaveri-hero-brand-values {
      color: var(--muted);
      font-family: var(--font-ui);
      font-size: clamp(8px, .85vw, 11px);
      font-weight: 600;
      letter-spacing: .15px;
      white-space: nowrap;
    }

    .onehaveri-hero-brand-motto {
      color: var(--terracotta);
      font-family: var(--font-kannada);
      font-size: clamp(9px, .95vw, 12px);
      font-weight: 700;
      white-space: nowrap;
    }

    .onehaveri-hero-brand-motto span {
      color: var(--terracotta);
      font-family: var(--font-display);
      font-style: italic;
      font-weight: 700;
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
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    @media (max-width: 600px) {
      .hero {
        aspect-ratio: 8 / 3 !important;
        max-height: 220px !important;
      }

      .hero::before {
        background-image: url("${mobileBanner}") !important;
      }

      .onehaveri-hero-brand {
        top: 9px;
        left: 9px;
        gap: 6px;
        max-width: 68%;
        padding: 5px 9px 5px 5px;
      }

      .onehaveri-hero-brand-logo {
        width: 43px;
        height: 43px;
      }

      .onehaveri-hero-brand-name {
        font-size: 15px;
        letter-spacing: -.35px;
      }

      .onehaveri-hero-brand-values {
        font-size: 7px;
      }

      .onehaveri-hero-brand-motto {
        font-size: 7px;
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

  if (!document.getElementById("onehaveri-hero-brand")) {
    const brand = document.createElement("div");
    brand.id = "onehaveri-hero-brand";
    brand.className = "onehaveri-hero-brand";
    brand.setAttribute("aria-label", "OneHaveri — People, Places, Possibilities");
    brand.innerHTML = `
      <img class="onehaveri-hero-brand-logo" src="logo1.png" alt="OneHaveri Karnataka logo">
      <div class="onehaveri-hero-brand-copy">
        <div class="onehaveri-hero-brand-name">OneHaveri</div>
        <div class="onehaveri-hero-brand-values">People • Places • Possibilities</div>
        <div class="onehaveri-hero-brand-motto">ನಮ್ಮ ಹಾವೇರಿ <span>| Together.</span></div>
      </div>
    `;
    hero.appendChild(brand);
  }

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
