/* ========================================================================== 
   MAIN PAGE BEHAVIOUR
   --------------------------------------------------------------------------
   Shared homepage logic for index.html and home_ip.html.
   Partner data and partner rendering remain in partners.js.
   ========================================================================== */

const HERO_COPY = Object.freeze({
  heading: "ಹಾವೇರಿಯ ಬದುಕು, ಹಾವೇರಿಯವರ ಮಾತು.",
  tagline: "Don't wait. Stand for your place."
});

function initHeroBanner() {
  const hero = document.querySelector(".hero");
  if (!hero || hero.dataset.heroInitialized === "true") return;

  const bannerNumber = Math.floor(Math.random() * 3) + 1;
  const desktopBanner = `assets/banners/banner${bannerNumber}-desktop.webp`;
  const mobileBanner = `assets/banners/banner${bannerNumber}-mobile.webp`;

  const style = document.createElement("style");
  style.id = "onehaveri-hero-runtime-style";
  style.textContent = `
    .hero {
      position: relative !important;
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
    .hero::after { display: none !important; content: none !important; }
    .onehaveri-hero-copy-panel {
      position: absolute;
      left: 50%;
      bottom: clamp(14px, 3.2%, 24px);
      transform: translateX(-50%);
      z-index: 4;
      width: min(52%, 590px);
      min-height: 25%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: clamp(12px, 1.4vw, 19px) clamp(16px, 2.2vw, 30px);
      text-align: center;
      border: 1px solid rgba(248,241,227,.78);
      border-radius: 22px;
      background: transparent;
      box-shadow: 0 12px 30px rgba(46,33,23,.18), 0 0 0 4px rgba(248,241,227,.18), 0 0 26px rgba(217,161,63,.18);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      transition: transform .22s ease, box-shadow .22s ease, background .22s ease;
    }
    .onehaveri-hero-copy-panel:hover {
      transform: translateX(-50%) translateY(-3px);
      background: transparent;
      box-shadow: 0 15px 34px rgba(46,33,23,.23), 0 0 0 5px rgba(248,241,227,.22), 0 0 34px rgba(217,161,63,.30);
    }
    .onehaveri-hero-copy-panel .hero-heading {
      margin: 0 !important;
      max-width: none !important;
      font-family: var(--font-kannada) !important;
      font-size: clamp(17px, 2.1vw, 30px) !important;
      line-height: 1.25 !important;
      font-weight: 700 !important;
      color: var(--ink) !important;
      text-shadow: 0 1px 0 rgba(255,255,255,.45);
    }
    .onehaveri-hero-copy-panel .tagline {
      margin: 0 !important;
      max-width: none !important;
      display: block !important;
      font-family: var(--font-display) !important;
      font-size: clamp(10px, 1.05vw, 14px) !important;
      line-height: 1.35 !important;
      font-style: italic !important;
      font-weight: 700 !important;
      color: var(--terracotta) !important;
    }
    .onehaveri-hero-copy-panel .tagline::before,
    .onehaveri-hero-copy-panel .tagline::after,
    .onehaveri-hero-copy-panel .divider { display: none !important; content: none !important; }
    .onehaveri-hero-brand {
      position: absolute;
      top: clamp(12px, 2.1vw, 24px);
      left: clamp(12px, 2.1vw, 24px);
      z-index: 5;
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
    }
    .onehaveri-hero-brand-logo { width: clamp(58px, 7.2vw, 82px); height: clamp(58px, 7.2vw, 82px); flex: 0 0 auto; object-fit: contain; border-radius: 50%; background: rgba(248,241,227,.95); box-shadow: 0 0 0 2px rgba(255,255,255,.8), 0 3px 12px rgba(46,33,23,.16), 0 0 18px rgba(217,161,63,.25); }
    .onehaveri-hero-brand-copy { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; line-height: 1.05; text-align: left; }
    .onehaveri-hero-brand-name { color: var(--olive); font-family: var(--font-ui); font-size: clamp(18px, 2.1vw, 27px); font-weight: 800; letter-spacing: -.7px; white-space: nowrap; }
    .onehaveri-hero-brand-values { color: var(--muted); font-family: var(--font-ui); font-size: clamp(8px, .85vw, 11px); font-weight: 600; white-space: nowrap; }
    .onehaveri-hero-brand-motto { color: var(--terracotta); font-family: var(--font-kannada); font-size: clamp(9px, .95vw, 12px); font-weight: 700; white-space: nowrap; }
    .onehaveri-hero-brand-motto span { color: var(--terracotta); font-family: var(--font-display); font-style: italic; font-weight: 700; }
    .hero > .status { top: 14px !important; left: 50% !important; right: auto !important; transform: translateX(-50%) !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; padding: 9px 18px !important; margin: 0 !important; border: 1px solid rgba(156,74,46,.24) !important; border-radius: 999px !important; background: rgba(248,241,227,.94) !important; color: var(--terracotta) !important; font-size: clamp(12px, 1.3vw, 15px) !important; font-weight: 700 !important; box-shadow: 0 0 0 4px rgba(248,241,227,.20), 0 5px 18px rgba(46,33,23,.16), 0 0 20px rgba(217,161,63,.24) !important; white-space: nowrap !important; }
    .hero > .status::before { content: "" !important; width: 9px !important; height: 9px !important; flex: 0 0 9px !important; border-radius: 50% !important; background: #D9A13F !important; box-shadow: 0 0 0 3px rgba(217,161,63,.18), 0 0 12px rgba(217,161,63,.75) !important; }
    .section-wave { display: none !important; height: 0 !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; }
    @media (max-width: 600px) {
      .hero { aspect-ratio: 8 / 3 !important; max-height: 220px !important; }
      .hero::before { background-image: url("${mobileBanner}") !important; }
      .onehaveri-hero-copy-panel { width: 88%; min-height: 30%; bottom: 9px; gap: 3px; padding: 8px 11px; border-radius: 15px; }
      .onehaveri-hero-copy-panel .hero-heading { font-size: clamp(13px, 3.7vw, 19px) !important; line-height: 1.2 !important; }
      .onehaveri-hero-copy-panel .tagline { font-size: 9px !important; }
      .onehaveri-hero-brand {
        top: clamp(7px, 2.5vw, 11px);
        left: clamp(7px, 2.5vw, 11px);
        gap: clamp(4px, 1.4vw, 6px);
        max-width: min(58%, 240px);
        padding: clamp(3px, 1.2vw, 5px) clamp(5px, 2vw, 8px) clamp(3px, 1.2vw, 5px) clamp(3px, 1.2vw, 5px);
        box-sizing: border-box;
      }
      .onehaveri-hero-brand-logo {
        width: clamp(36px, 10vw, 42px);
        height: clamp(36px, 10vw, 42px);
      }
      .onehaveri-hero-brand-name { font-size: clamp(12px, 3.6vw, 14px); letter-spacing: -.3px; }
      .onehaveri-hero-brand-values, .onehaveri-hero-brand-motto { font-size: clamp(5.8px, 1.65vw, 7px); }
      .hero > .status {
        top: clamp(8px, 2.5vw, 11px) !important;
        left: auto !important;
        right: clamp(7px, 2.5vw, 11px) !important;
        transform: none !important;
        width: min(34%, 128px) !important;
        max-width: 34% !important;
        box-sizing: border-box !important;
        padding: clamp(5px, 1.5vw, 7px) clamp(6px, 2vw, 9px) !important;
        font-size: clamp(9px, 2.6vw, 11px) !important;
        gap: 4px !important;
        z-index: 6 !important;
      }
      .hero > .status::before { width: 6px !important; height: 6px !important; flex-basis: 6px !important; }
    }
  `;

  document.head.appendChild(style);

  const heading = hero.querySelector(".hero-heading");
  const tagline = hero.querySelector(".tagline");
  if (heading) heading.textContent = HERO_COPY.heading;
  if (tagline) tagline.textContent = HERO_COPY.tagline;

  if (!document.getElementById("onehaveri-hero-copy-panel") && heading && tagline) {
    const copyPanel = document.createElement("div");
    copyPanel.id = "onehaveri-hero-copy-panel";
    copyPanel.className = "onehaveri-hero-copy-panel";
    copyPanel.setAttribute("aria-label", "OneHaveri hero message");
    hero.insertBefore(copyPanel, heading);
    copyPanel.appendChild(heading);
    copyPanel.appendChild(tagline);
  }

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

  hero.dataset.heroInitialized = "true";
  hero.dataset.banner = String(bannerNumber);
  hero.dataset.desktopBanner = desktopBanner;
  hero.dataset.mobileBanner = mobileBanner;
}

document.addEventListener("DOMContentLoaded", initHeroBanner);
