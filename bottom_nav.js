/* ================================================================
   OneHaveri — Bottom Navigation + Account (Supabase Auth)
   ----------------------------------------------------------------
   This file builds the floating bottom nav and the sign-in panel,
   and injects both into the page on load. Styling lives entirely
   in bottom_nav.css — this file only decides WHAT to show, not
   how it looks.

   TO ADD / CHANGE A NAV LINK:
   Edit the NAV_LINKS array below. Nothing else needs to change —
   the rendering code loops over it automatically.

   TO CHANGE WHICH LINK IS THE RAISED "CREATE" BUTTON:
   Set isAccent: true on exactly one entry in NAV_LINKS.
   ================================================================ */


/* ---------------------------------------------------------------
   Supabase project connection.
   Passkeys are a Supabase beta feature — opt-in required via
   auth.experimental.passkey. Needs supabase-js v2.105.0+.
   --------------------------------------------------------------- */
const SUPABASE_URL = "https://zdgbtjelxhriggjavecp.supabase.co";
const SUPABASE_KEY = "sb_publishable_G2vSbiWDeNBPcJCQb0GEUg_S9GvaCVO";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    experimental: { passkey: true }
  }
});


/* ---------------------------------------------------------------
   Nav links, in display order.

   href      — where the link goes.
   label     — used for the accessible aria-label (screen readers)
               and to look the link back up in code.
   isAccent  — true for exactly one link: renders as the raised,
               accent-colored circular button instead of a flat
               icon (the ".create-post" style in bottom_nav.css).
   outline / filled — two versions of the icon: "outline" shows
               normally, "filled" swaps in when the link is active
               (bottom_nav.css handles the swap via CSS classes).
   --------------------------------------------------------------- */
const NAV_LINKS = [
  {
    href: "/",
    label: "Home",
    isAccent: false,
    outline: `<path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>`,
    filled:  `<path fill="currentColor" d="M12 2.5 2.5 10.3V21a1 1 0 0 0 1 1H9v-7h6v7h5.5a1 1 0 0 0 1-1V10.3L12 2.5Z"/>`
  },
  {
    href: "/new-post.html",
    label: "New post",
    isAccent: true,
    outline: `<path d="M12 8v8M8 12h8"/>`,
    filled:  `<path d="M12 8v8M8 12h8"/>`
  },
  {
    href: "#",
    label: "Account",
    isAccent: false,
    outline: `<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3-6 8-6s8 2 8 6"/>`,
    filled:  `<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c0-4 3-6 8-6s8 2 8 6" fill="currentColor"/>`
  }
];


document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------
     Build and insert the nav bar itself.
     ------------------------------------------------------------ */
  const nav = document.createElement("nav");
  nav.className = "onehaveri-bottom-nav";

  nav.innerHTML = NAV_LINKS.map(link => {
    const classes = link.isAccent ? "create-post" : "";
    return `
      <a href="${link.href}" aria-label="${link.label}" class="${classes}">
        <svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${link.outline}</svg>
        <svg class="icon-filled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${link.filled}</svg>
      </a>
    `;
  }).join("");

  document.body.appendChild(nav);

  const accountLink = nav.querySelector('a[aria-label="Account"]');

  accountLink.addEventListener("click", (e) => {
    e.preventDefault();
    openAuthPanel();
  });


  /* ------------------------------------------------------------
     Build and insert the account panel (hidden until opened).
     ------------------------------------------------------------ */
  const overlay = document.createElement("div");
  overlay.id = "ohAuthOverlay";
  overlay.className = "oh-auth-overlay";
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="oh-auth-panel">
      <button type="button" class="oh-auth-close" aria-label="Close">×</button>
      <div class="oh-auth-tag">OneHaveri Account</div>
      <div id="ohAuthBody"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".oh-auth-close").addEventListener("click", closeAuthPanel);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAuthPanel();
  });

  function openAuthPanel() {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    renderAuthBody();
  }

  function closeAuthPanel() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  }


  /* ------------------------------------------------------------
     Render the panel's contents: signed-out (Google / passkey
     sign-in) vs. signed-in (email, add passkey, sign out).
     ------------------------------------------------------------ */
  function renderAuthBody() {
    sb.auth.getSession().then(({ data }) => {
      const session = data.session;
      const body = document.getElementById("ohAuthBody");

      if (session) {
        body.innerHTML = `
          <h3 class="oh-auth-title">Signed in</h3>
          <p class="oh-auth-sub">${session.user.email || "Your account"}</p>

          <button type="button" class="oh-auth-btn oh-auth-passkey" id="ohAddPasskeyBtn">
            ${passkeyIconSvg()}
            Add a passkey to this device
          </button>

          <button type="button" class="oh-auth-btn oh-auth-signout" id="ohSignOutBtn">
            Sign out
          </button>

          <div class="oh-auth-status" id="ohAuthStatus"></div>
        `;

        document.getElementById("ohAddPasskeyBtn").addEventListener("click", async () => {
          const { error } = await sb.auth.registerPasskey();
          if (error) {
            showStatus(error.message, true);
          } else {
            showStatus("Passkey added — you can use it to sign in faster next time.", false);
            // Give the person a moment to read the confirmation
            // before the panel closes itself.
            setTimeout(closeAuthPanel, 1400);
          }
        });

        document.getElementById("ohSignOutBtn").addEventListener("click", async () => {
          await sb.auth.signOut();
          closeAuthPanel();
          refreshAuthUI();
        });

      } else {
        body.innerHTML = `
          <h3 class="oh-auth-title">Sign in to OneHaveri</h3>
          <p class="oh-auth-sub">Save your contributions and come back anytime.</p>

          <button type="button" class="oh-auth-btn oh-auth-google" id="ohGoogleBtn">
            ${googleIconSvg()}
            Continue with Google
          </button>

          <button type="button" class="oh-auth-btn oh-auth-passkey" id="ohPasskeyBtn">
            ${passkeyIconSvg()}
            Sign in with passkey
          </button>

          <p class="oh-auth-note">No account yet? Continuing with Google creates one automatically.</p>
          <div class="oh-auth-status" id="ohAuthStatus"></div>
        `;

        document.getElementById("ohGoogleBtn").addEventListener("click", async () => {
          const { error } = await sb.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.href }
          });
          if (error) showStatus(error.message, true);
        });

        document.getElementById("ohPasskeyBtn").addEventListener("click", async () => {
          const { error } = await sb.auth.signInWithPasskey();
          if (error) {
            showStatus("No passkey found on this device — try Continue with Google instead.", true);
          } else {
            closeAuthPanel();
            refreshAuthUI();
          }
        });
      }
    });
  }

  function showStatus(message, isError) {
    const status = document.getElementById("ohAuthStatus");
    if (!status) return;
    status.textContent = message;
    status.className = "oh-auth-status" + (isError ? " oh-auth-status-error" : "");
  }


  /* ------------------------------------------------------------
     Keep the Account icon showing "signed in" state (filled +
     accent color) whenever there's an active session.
     ------------------------------------------------------------ */
  function refreshAuthUI() {
    sb.auth.getSession().then(({ data }) => {
      accountLink.classList.toggle("active", !!data.session);
    });
  }

  refreshAuthUI();
  sb.auth.onAuthStateChange(() => refreshAuthUI());


  /* ------------------------------------------------------------
     Inline icon svgs for the auth panel's own buttons (separate
     from the nav bar icons above, since these appear inside the
     dynamically-built panel markup).
     ------------------------------------------------------------ */
  function googleIconSvg() {
    return `<svg viewBox="0 0 48 48" width="18" height="18">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l6-6C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c2.8 0 5.3 1 7.3 2.7l6-6C34 6.5 29.3 4.5 24 4.5c-7.6 0-14.1 4.3-17.4 10.6z"/>
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 34.7 26.8 35.5 24 35.5c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.8 39.1 16.4 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.2 5.2C39.7 34.8 43.5 30 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
    </svg>`;
  }

  function passkeyIconSvg() {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="8" cy="8" r="4"/>
      <path d="M10.5 11 20 20.5M17 17l2-2M14 14l2-2"/>
    </svg>`;
  }

});
