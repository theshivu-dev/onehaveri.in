/* ==========================================================================
   CLOSE BRANDS DATA & RENDERER — "ನಮ್ಮ ವಲಯ" (Namma Valaya)
   ----------------------------------------------------------------
   A small, closed circle of things built by people close to
   OneHaveri. Kept entirely separate from partners.js/partners.css
   on purpose — different intent, different data, so this whole
   feature can be redesigned or moved to its own page later without
   touching the partners code at all.

   TO ADD A NEW ENTRY LATER:
   Add a new key to CLOSE_BRANDS_DATA below, using whichever "type"
   fits it (see the two examples). Nothing else needs to change —
   the grid in close_brands.css wraps automatically.
   ========================================================================== */

const CLOSE_BRANDS_DATA = {

  // ENTRY 1: Renowatt — dark card, their own logo, a short tagline.
  // Their real logo is white-text-on-transparent, so it needs the
  // dark card background to be visible at all.
  "renowatt": {
    type: "logo-card",
    logoUrl: "https://www.renowatt.in/renowatt-no-bg-english-white-font.avif",
    logoAlt: "Renowatt",
    tagline: "Building the Energy Infrastructure of Tomorrow",
    linkUrl: "https://www.renowatt.in"
  },

  // ENTRY 2: SnehaKoota — a photo tile with the name overlaid.
  // imageUrl expects a file sitting in this same repo folder —
  // see the filename note in the README / build notes.
  "snehakoota": {
    type: "photo-card",
    imageUrl: "close-brands-snehakoota.png",
    label: "SnehaKoota.in",
    linkUrl: "https://snehakoota.in"
  }

  /* ENTRY 3: ADD FUTURE ENTRIES HERE, e.g.
  , "future-id": {
    type: "logo-card",
    logoUrl: "future-logo.png",
    logoAlt: "Future Brand",
    tagline: "One line about them.",
    linkUrl: "https://example.com"
  }
  */
};

document.addEventListener("DOMContentLoaded", () => {
  renderCloseBrands();
});

function renderCloseBrands() {
  const containers = document.querySelectorAll("[data-close-brands]");

  containers.forEach((container) => {
    const tilesHtml = Object.values(CLOSE_BRANDS_DATA)
      .map((entry) => renderTile(entry))
      .join("");

    container.innerHTML = `
      <div class="valaya-zone">
        <h2 class="valaya-heading">ನಮ್ಮ ವಲಯ</h2>
        <div class="valaya-grid">
          ${tilesHtml}
        </div>
      </div>
    `;
  });
}

// Builds one tile's markup according to its "type". Adding a new
// type later means adding one more branch here, matched by a new
// .valaya-tile.<type-name> block in close_brands.css.
function renderTile(entry) {
  if (entry.type === "logo-card") {
    return `
      <a href="${entry.linkUrl}" target="_blank" rel="noopener noreferrer" class="valaya-tile logo-card">
        <img src="${entry.logoUrl}" alt="${entry.logoAlt}">
        <p class="valaya-tagline">${entry.tagline}</p>
      </a>
    `;
  }

  if (entry.type === "photo-card") {
    return `
      <a href="${entry.linkUrl}" target="_blank" rel="noopener noreferrer" class="valaya-tile photo-card" style="background-image:url('${entry.imageUrl}')">
        <div class="valaya-photo-overlay">
          <p class="valaya-label">${entry.label}</p>
        </div>
      </a>
    `;
  }

  return "";
}
