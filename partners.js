/* ========================================================================== 
   PARTNER DATA & RENDERER
   --------------------------------------------------------------------------
   Partner data and partner-specific rendering only.
   Homepage hero behavior lives in main_page.js.
   ========================================================================== */

/* Compatibility fallback for pages that have not yet added the direct
   main_page.js script reference. Remove once both homepage HTML files are
   updated with the direct script tag. */
(function loadMainPageBehavior() {
  if (document.querySelector('script[data-main-page-behavior]')) return;
  const script = document.createElement('script');
  script.src = 'main_page.js?v=1';
  script.dataset.mainPageBehavior = 'true';
  document.head.appendChild(script);
})();

const PARTNERS_DATA = {
  "nammashale": {
    brandText: "Namma",
    brandHighlight: "ಶಾಲೆ",
    badge: "ಉಪಯುಕ್ತ ಇನಿಶಿಯೇಟಿವ್",
    title: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಶಾಲೆಗಳ ನಕ್ಷೆ",
    description: "ಕರ್ನಾಟಕದ ಸರ್ಕಾರಿ ಶಾಲೆಗಳ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಸಮಸ್ಯೆಗಳನ್ನು ತಿಳಿಯಲು ಹಾಗೂ ಸಾರ್ವಜನಿಕವಾಗಿ ವರದಿ ಮಾಡಲು ರೂಪಿಸಲಾದ ನಕ್ಷೆ.",
    linkUrl: "https://nammashale.in",
    themeClass: "partner-1-nammashale"
  }
};

document.addEventListener("DOMContentLoaded", renderPartnerInitiatives);

function renderPartnerInitiatives() {
  const partnerContainers = document.querySelectorAll("[data-partner]");

  partnerContainers.forEach((container) => {
    const partnerKey = container.getAttribute("data-partner");
    const data = PARTNERS_DATA[partnerKey];

    if (!data) return;

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
