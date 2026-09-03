/* ================================================================
   OneHaveri — Floating Bottom Navigation + Account Panel
   ----------------------------------------------------------------
   Shared component styling. Page geometry belongs to main_page.css;
   this file only owns the bottom navigation and its account panel.

   PHASE 4C
   --------
   Keep navigation clearance scoped to pages that actually contain
   the dynamically injected bottom-nav component. The navigation
   must not impose bottom padding on unrelated pages merely because
   this stylesheet is loaded there.
   ================================================================ */

:root{
  --nav-icon-size:        44px;
  --nav-icon-svg-size:    22px;
  --nav-padding-y:        12px;/* ================================================================
   OneHaveri — Bottom Navigation + Account (Supabase Auth)
   ----------------------------------------------------------------
   This file builds the floating bottom nav and the sign-in panel,
   and injects both into the page on load. Styling lives entirely
   in bottom_nav.css — this file only decides WHAT to show, not
   how it looks.

   TO ADD / CHANGE A NAV LINK:
   Edit the NAV_LINKS array below. Nothing else needs to change —
   the rendering code loops over it automatically.
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
   disabled  — keeps a future item present in the component while
               preventing navigation/action until its feature exists.
   isAccent  — retained for compatibility with the existing nav
               renderer. All three current items are flat.
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
    href: "#",
    label: "Navigation",
    disabled: true,
    isAccent: false,
    outline: `<path d="M5 7h14"/><path d="M5 12h14"/><path d="M5 17h14"/>`,
    filled:  `<path d="M5 7h14"/><path d="M5 12h14"/><path d="M5 17h14"/>`
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
    const classes = [
      link.isAccent ? "create-post" : "",
      link.disabled ? "nav-disabled" : ""
    ].filter(Boolean).join(" ");
    const disabledAttrs = link.disabled
      ? `aria-disabled="true" tabindex="-1"`
      : "";

    return `
      <a href="${link.href}" aria-label="${link.label}" class="${classes}" ${disabledAttrs}>
        <svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${link.outline}</svg>
        <svg class="icon-filled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${link.filled}</svg>
      </a>
    `;
  }).join("");

  document.body.appendChild(nav);

  /* Future Navigation item is intentionally inert for now. */
  const navigationLink = nav.querySelector('a[aria-label="Navigation"]');
  navigationLink?.addEventListener("click", (e) => {
    e.preventDefault();
  });

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

  --nav-padding-x:        16px;
  --nav-gap:              14px;
  --nav-gap-from-edge:    16px;
  --nav-safe-bottom:      env(safe-area-inset-bottom, 0px);
  --nav-screen-gutter:    18px;
  --nav-accent-size:      56px;
  --nav-accent-lift:      -14px;
  --nav-total-height:     calc(var(--nav-icon-size) + (var(--nav-padding-y) * 2));
  --nav-clearance:        calc(var(--nav-total-height) + var(--nav-gap-from-edge) + var(--nav-safe-bottom) + 28px);
  --nav-ink:              #B36A45;
  --nav-accent:           #9C4A2E;
  --nav-accent-dark:      #7C3B22;
  --nav-accent-tint:      rgba(156, 74, 46, 0.10);
  --nav-bg:               rgba(248, 243, 235, 0.96);
  --nav-border:           rgba(156, 74, 46, 0.15);
}

body:has(.onehaveri-bottom-nav){
  padding-bottom: var(--nav-clearance);
}

.onehaveri-bottom-nav{
  position: fixed;
  bottom: calc(var(--nav-gap-from-edge) + var(--nav-safe-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  display: flex;
  align-items: center;
  gap: var(--nav-gap);
  padding: var(--nav-padding-y) var(--nav-padding-x);
  width: max-content;
  max-width: calc(100vw - (var(--nav-screen-gutter) * 2));
  box-sizing: border-box;
  background: var(--nav-bg);
  border: 1px solid var(--nav-border);
  border-radius: 999px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 10px 28px rgba(46, 33, 23, 0.12),
    0 2px 8px rgba(46, 33, 23, 0.06);
  transition: opacity .2s ease, transform .2s ease;
}

.onehaveri-bottom-nav a{
  width: var(--nav-icon-size);
  height: var(--nav-icon-size);
  flex: 0 0 var(--nav-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--nav-ink);
  border-radius: 50%;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color .2s ease, color .2s ease, transform .15s ease;
}

.onehaveri-bottom-nav a:hover{
  background: var(--nav-accent-tint);
}

.onehaveri-bottom-nav a:active{
  transform: scale(.92);
}

.onehaveri-bottom-nav a.active{
  color: var(--nav-accent);
  background: var(--nav-accent-tint);
}

.onehaveri-bottom-nav svg{
  width: var(--nav-icon-svg-size);
  height: var(--nav-icon-svg-size);
}

.onehaveri-bottom-nav a .icon-filled{
  display: none;
}
.onehaveri-bottom-nav a.active .icon-outline{
  display: none;
}
.onehaveri-bottom-nav a.active .icon-filled{
  display: block;
}

/* ----------------------------------------------------------------
   Future Navigation item — intentionally inert and visually normal.
   The feature remains in NAV_LINKS but is hidden from interaction
   until a real navigation menu is implemented.
   ---------------------------------------------------------------- */
.onehaveri-bottom-nav .nav-disabled{
  cursor: default;
  pointer-events: none;
  opacity: .82;
}

.onehaveri-bottom-nav .nav-disabled:focus{
  outline: none;
}

.onehaveri-bottom-nav .create-post{
  width: var(--nav-icon-size);
  height: var(--nav-icon-size);
  flex: 0 0 var(--nav-icon-size);
  margin-top: 0;
  background: transparent;
  color: var(--nav-ink);
  box-shadow: none;
}

.onehaveri-bottom-nav .create-post svg{
  width: var(--nav-icon-svg-size);
  height: var(--nav-icon-svg-size);
}

.onehaveri-bottom-nav .create-post:hover{
  background: var(--nav-accent-tint);
  color: var(--nav-ink);
}

.onehaveri-bottom-nav .create-post:active{
  transform: scale(.92);
}

.onehaveri-bottom-nav.is-compact{
  transform: translateX(-50%) scale(.9);
  opacity: .85;
}
.onehaveri-bottom-nav.is-hidden{
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(20px);
}

body.survey-is-open .onehaveri-bottom-nav{
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 768px){
  .onehaveri-bottom-nav{
    gap: 12px;
  }
}

@media (max-width: 360px){
  .onehaveri-bottom-nav{
    --nav-icon-size: 42px;
    --nav-accent-size: 54px;
    --nav-padding-x: 13px;
    --nav-padding-y: 10px;
    --nav-gap: 10px;
  }
}


/* ================================================================
   ACCOUNT PANEL (Google / Passkey sign-in, signed-in state)
   ================================================================ */

.oh-auth-overlay{
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: none;
  align-items: flex-end;
  justify-content: center;
  padding: 18px 18px max(110px, calc(env(safe-area-inset-bottom) + 100px));
  background: rgba(46, 33, 23, 0.35);
  backdrop-filter: blur(3px);
}
.oh-auth-overlay.show{
  display: flex;
}

.oh-auth-panel{
  width: 100%;
  max-width: 420px;
  background: #F8F1E3;
  border: 1px solid var(--nav-border);
  border-radius: 22px;
  padding: 22px 20px 20px;
  position: relative;
  box-shadow: 0 20px 60px rgba(46, 33, 23, 0.25);
  animation: ohAuthUp .25s ease;
}
@keyframes ohAuthUp{
  from{ opacity: 0; transform: translateY(20px); }
  to{ opacity: 1; transform: translateY(0); }
}

.oh-auth-close{
  position: absolute;
  right: 14px;
  top: 14px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: rgba(156, 74, 46, 0.08);
  color: var(--nav-ink);
  font-size: 18px;
  cursor: pointer;
}

.oh-auth-tag{
  color: var(--nav-accent);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.oh-auth-title{
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: #2E2117;
}

.oh-auth-sub{
  margin: 0 0 16px;
  color: #5B4A38;
  font-size: 11.5px;
  line-height: 1.45;
  word-break: break-word;
}

.oh-auth-btn{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(156, 74, 46, 0.20);
  background: #fff;
  color: #2E2117;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background .2s ease, transform .1s ease;
}
.oh-auth-btn:hover{
  background: rgba(156, 74, 46, 0.05);
}
.oh-auth-btn:active{
  transform: scale(.98);
}

.oh-auth-btn.oh-auth-passkey{
  background: var(--nav-accent);
  color: #fff;
  border: 0;
}
.oh-auth-btn.oh-auth-passkey:hover{
  background: var(--nav-accent-dark);
}

.oh-auth-btn.oh-auth-signout{
  background: transparent;
  border: 1px solid rgba(156, 74, 46, 0.20);
  color: var(--nav-ink);
}

.oh-auth-note{
  margin: 4px 0 0;
  color: var(--nav-ink);
  font-size: 9.5px;
  line-height: 1.4;
  text-align: center;
}

.oh-auth-status{
  margin-top: 8px;
  font-size: 10.5px;
  line-height: 1.4;
  text-align: center;
  color: #3F5B3E;
  min-height: 14px;
}
.oh-auth-status.oh-auth-status-error{
  color: #9C4A2E;
}
