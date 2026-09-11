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


  // ENTRY 1: Renowatt — dark card, their own logo, a short tagline.
  // Their real logo is white-text-on-transparent, so it needs the
  // dark card background to be visible at all.
 

  // ENTRY 2: SnehaKoota — a photo tile with the name overlaid.
  // imageUrl expects a file sitting in this same repo folder —
  // see the filename note in the README / build notes.
 

  /* ENTRY 3: ADD FUTURE ENTRIES HERE, e.g.
  , "future-id": {
    type: "logo-card",
    logoUrl: "future-logo.png",
    logoAlt: "Future Brand",
    tagline: "One line about them.",
    linkUrl: "https://example.com"
  }
  */
document.addEventListener("DOMContentLoaded", function () {
    const mountPoint = document.querySelector("[data-close-brands]");
    if (!mountPoint) return;

    // HTML Markup injection
    mountPoint.innerHTML = `
        <div class="close-brands-container">
            <div class="close-brands-header">
                <h2>ನಮ್ಮ ವಲಯ</h2>
            </div>
            <div class="close-brands-grid">
                <!-- Renowatt Card (40%) -->
                <a href="https://www.renowatt.in" target="_blank" rel="noopener noreferrer" class="close-brand-tile renowatt-tile">
                    <img src="https://www.renowatt.in/renowatt-no-bg-english-white-font.avif" alt="Renowatt Logo" class="renowatt-logo" />
                    <p class="renowatt-tagline">Building the Energy Infrastructure of Tomorrow</p>
                </a>

                <!-- SnehaKoota Card (60%) -->
                <a href="https://snehakoota.in" target="_blank" rel="noopener noreferrer" class="close-brand-tile snehakoota-tile" style="background-image: url('close-brands-snehakoota.jpg');">
                    <div class="snehakoota-overlay">
                        <span class="snehakoota-text">SnehaKoota.in</span>
                    </div>
                </a>
            </div>
        </div>
    `;
});
