/* ================================================================
   OneHaveri — Stable Hero Banner Selection
   ----------------------------------------------------------------
   Select exactly one banner per page load. No rotation, no timer.
   To add future banners, extend the BANNER_FILES array only.
   ================================================================ */

(() => {
  const BANNER_FILES = ["banner1.png", "banner2.png", "banner3.png"];

  function applyStableBanner() {
    const heroes = document.querySelectorAll(".hero");
    if (!heroes.length || !BANNER_FILES.length) return;

    const selected = BANNER_FILES[Math.floor(Math.random() * BANNER_FILES.length)];
    const imageValue = `url("${selected}")`;

    heroes.forEach(hero => {
      hero.style.setProperty("--onehaveri-banner-image", imageValue);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyStableBanner, { once: true });
  } else {
    applyStableBanner();
  }
})();
