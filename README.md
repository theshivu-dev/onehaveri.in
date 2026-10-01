# OneHaveri.in — Project Rules & Development Standards

> **Last updated:** 2026-10-01
>
> This README is the working contract for AI-assisted development of OneHaveri.in. It records the project's purpose, architectural decisions, current component structure, responsive-design direction, and important decisions made during development so future sessions can continue without losing context.

---

## 1. Project purpose

**OneHaveri.in** is an evolving public/community-oriented platform for Haveri and people connected to Haveri.

The long-term intention is to bring together useful local information, people's voices, stories, concerns, ideas, opportunities and participation in one place.

The project is intentionally being built gradually by an individual developer with limited development time. The website therefore values **steady, maintainable progress over premature complexity**.

Current work is still an early/in-progress foundation. The site should be allowed to grow over time rather than pretending that every planned feature already exists.

Core intentions include:

- Give Haveri-related voices, stories, concerns and ideas a place.
- Encourage people to participate rather than simply consume information.
- Eventually support useful local information, public issues, opportunities, businesses, events, stories and community contributions.
- Provide useful links to good initiatives that already exist instead of unnecessarily rebuilding everything inside OneHaveri.
- Keep the website open and useful to the wider Haveri community.
- Build a foundation that can expand substantially without repeatedly rewriting the existing page.

---

## 2. Golden rule for AI-assisted development

Any AI tool working on this repository must read this README and inspect the current repository before making or proposing changes.

Before modifying a page or shared file:

1. Inspect the current repository and relevant files.
2. Understand the existing HTML, CSS, JavaScript and component relationships.
3. Check whether the requested behaviour already exists elsewhere.
4. Reuse existing components/patterns wherever practical.
5. Make the smallest safe change that satisfies the request.
6. Do not rewrite an entire page when a targeted change is sufficient.
7. Do not remove existing functionality unless explicitly requested.
8. Do not introduce duplicate controls, buttons, icons, links or functionality.
9. Do not silently change unrelated pages or shared components.
10. Keep implementation understandable for a non-specialist owner who maintains the project with AI assistance.
11. After a repository change, review the actual changed file again and explain what changed and what was intentionally left untouched.

### Write/commit confirmation

When a future session proposes a repository mutation, the intended change should first be explained clearly in chat. Do not make broad or unrelated repository changes without the owner's explicit go-ahead.

For a directly requested, narrowly defined change, implement only that requested scope.

---

## 3. Development philosophy

OneHaveri uses a **static-web-first, component-oriented approach**.

Prefer:

- HTML
- CSS
- Vanilla JavaScript
- Existing browser APIs
- Existing project assets
- Small, understandable external dependencies only when necessary

Avoid adding frameworks, build systems, packages or architectural complexity unless there is a clear requirement and the change is justified.

The current architecture should remain capable of growing into a larger application later.

---

## 4. Current page and development workflow

`home_ip.html` is the current **in-progress working page** used while the homepage is being developed.

`index.html` is the public landing page. During the current development stage, the owner may copy the accepted `home_ip.html` state into `index.html` when ready to publish the latest homepage version.

Do not assume that every change made to `home_ip.html` should automatically be made to `index.html`. Confirm the intended synchronization step.

The current repository contains both pages. Do not assume they are synchronized unless their current repository state has been checked.

---

## 5. Current homepage concept

The current in-progress homepage contains the following conceptual sections:

1. **Hero / identity**
   - Kannada statement: `ಹಾವೇರಿಯ ಬದುಕು, ಹಾವೇರಿಯವರ ಮಾತು.`
   - English positioning line: `Don't wait. Stand for your place.`
   - Short introduction explaining that Haveri has stories, voices and ideas.

2. **Three introductory cards**
   - `ಏನಾಗುತ್ತಿದೆ?`
   - `ನಮಗೆ ಮುಖ್ಯವಾದುದು`
   - `ಕನಸುಗಳು`

   These are early content placeholders and are expected to evolve.

3. **Survey invitation**
   - A short survey about Haveri.
   - Current survey data and interaction logic remain in the page-specific JavaScript in the working page.
   - Google Apps Script is currently used as the submission endpoint.
   - LocalStorage is retained as a development/testing safety copy.

4. **Join / contribution section**
   - Invites journalists, students, business owners, neighbours and others to contribute.
   - The contribution platform itself is still in progress.

5. **Partner / useful-initiative area**
   - A modular area for linking to worthwhile existing initiatives.
   - First partner: **NammaShale.in**.

6. **Community Portals area**
   - A current homepage module for useful Haveri-facing portals.
   - Current portal concepts are Blood Bank Portal, Skills & Jobs, Schools & Education, and Community Initiatives.
   - The portal artwork uses repository PNG assets and a Haveri landscape treatment.
   - Portal presentation is now separated into a shared container layer plus portal-specific CSS so one portal can be changed without unnecessarily affecting another.

7. **Bottom navigation**
   - Home
   - Navigation placeholder
   - Account

Future page sections, widgets, panels and navigation options are expected to be added incrementally.

---

## 6. Responsive design standard

OneHaveri is **mobile-first in audience, but NOT mobile-limited in architecture**.

The fact that almost all expected viewers may use phones must never become a reason to hard-code the entire website to a phone-sized canvas.

The page should:

- Adapt naturally to mobile widths.
- Use available width on tablets/laptops/desktops.
- Avoid artificial fixed-height/fixed-width compression.
- Allow content to grow vertically when content requires it.
- Avoid making the main page non-scrollable merely to fit a phone mockup.
- Preserve comfortable reading widths while allowing larger screens to use additional space.
- Use fluid CSS, Flexbox/Grid, `clamp()`, sensible max-widths and responsive breakpoints where appropriate.

The current homepage refinement is intentionally moving away from a phone-only fixed canvas toward a **modular responsive page**.

Future expansion may include:

- Left navigation panels.
- Top or thumb-reachable widgets.
- Additional content modules.
- Larger desktop layouts.
- Additional navigation destinations.

Do not build these prematurely, but do not architect the current page in a way that makes them difficult to add.

---

## 7. Component-level architecture

OneHaveri follows a simple hierarchy:

```text
GLOBAL / SHARED COMPONENT
    ↓
component-specific CSS / JS

PAGE
    ↓
page-level CSS / JS

PAGE CONTENT / SMALL COMPONENT
    ↓
keep local unless it becomes complex or reusable
```

### Shared component rule

A UI system that is reused across pages should have its own CSS/JS files.

### Page-level rule

Page layout, page geometry and page-specific shared behaviour should live in page-level files where practical.

Current examples:

- `main_page.css` → homepage/page-level layout and shared visual tokens.
- `home_ip.html` → page markup and page-specific content/logic that has not yet justified extraction.
- `portal_images.css` → stable homepage stylesheet entry point for the Community Portals component.
- `assets/portal/css/` → isolated portal component CSS.

### Component extraction rule

If a widget or component becomes large, complex, reusable or independently maintainable, move it into its own CSS/JS rather than allowing the page to become a monolith.

Do not split tiny one-off rules into unnecessary files merely for the sake of abstraction.

---

## 8. Bottom navigation component

The bottom navigation is a **standalone shared component**.

Files:

- `bottom_nav.css`
- `bottom_nav.js`

The bottom navigation currently contains three entries in this order:

```text
Home | Navigation | Account
```

### Current responsibilities

**Home**

- Represents the homepage.
- Navigates to `/`.

**Navigation**

- Uses a three-horizontal-line `☰` style icon.
- Is intentionally **inactive/inert for now**.
- Must not navigate anywhere.
- Must not open a panel yet.
- Remains in the code as a future navigation placeholder.
- Its disabled state is represented by a property in the navigation configuration and corresponding disabled behaviour.

**Account**

- Opens the existing account/authentication panel.
- Must retain the existing Supabase authentication behaviour.
- The icon can reflect signed-in state.

### Modular navigation rule

The navigation entries are configuration-driven through the `NAV_LINKS` array in `bottom_nav.js`.

Future changes to navigation order or entries should normally be made there rather than duplicating navigation markup across pages.

Do not put future navigation logic into the Navigation placeholder until the feature is actually being built.

### Important constraint

`bottom_nav.css` and `bottom_nav.js` are specific to the bottom navigation component. Do not place unrelated homepage/game/partner/portal logic there.

---

## 9. Account / authentication foundation

The Account item uses Supabase Auth.

Current frontend behaviour includes:

- Google sign-in.
- Passkey sign-in for existing credentials.
- Passkey registration for signed-in users.
- Sign-out.
- Session persistence.
- Automatic token refresh.
- Account panel rendering based on authentication state.
- Signed-in visual state on the Account navigation item.

The current Supabase client configuration is in `bottom_nav.js`.

The publishable Supabase key may be used in browser code as intended by Supabase's public-client model. Never place a Supabase service-role key or other privileged secret in browser JavaScript.

Authentication behaviour is a working component and must not be broken while changing bottom-navigation styling or other shared UI.

---

## 10. Partner / useful-initiative architecture

OneHaveri intentionally provides space for useful existing initiatives rather than requiring OneHaveri itself to provide every service.

The first example is **NammaShale.in**, a Karnataka government-schools mapping/reporting initiative whose purpose overlaps with the broader spirit of public participation and useful local/community work.

The owner contacted the NammaShale creator before placing the reference on OneHaveri.

### Partner files

- `partners.css`
- `partners.js`

### HTML-minimal principle

The main page should contain only a minimal partner placeholder, for example:

```html
<div id="partner-nammashale" data-partner="nammashale"></div>
```

The detailed markup, content rendering and partner-specific presentation should remain in `partners.js` and `partners.css`.

The goal is that adding a future partner should require only a small HTML placeholder plus a clearly numbered partner definition in the partner files.

### Partner numbering convention

Use clearly separated sections such as:

```text
PARTNER 1: NAMMASHALE
PARTNER 2: FUTURE PARTNER
PARTNER 3: ...
```

Keep global partner layout styles separate from partner-specific theme overrides.

### NammaShale visual rule

Only the **Nammaಶಾಲೆ wordmark** should borrow the recognisable black/yellow brand treatment of NammaShale.

The surrounding partner card must remain visually aligned with OneHaveri's own warm cream/terracotta/gold visual language.

Do not turn the entire OneHaveri partner card into a black/yellow NammaShale clone.

The earlier generic text `ಸಾರ್ವಜನಿಕ ಸಹಭಾಗಿತ್ವದ ಉದ್ಯಮ` was deliberately removed from the partner presentation.

The partner card should visually communicate that all of its content belongs to one partner entry rather than looking like unrelated page elements.

---

## 11. OneHaveri visual language

**Status: this section describes the current live direction, adopted 2026-09-04, replacing the original cream/terracotta/gold palette described in earlier checkpoints of this README.**

The established visual direction is **"Kempu Mannu / Red Soil & Fields"** — grounded in Haveri's actual laterite red soil and monsoon-green farmland, on a manila-parchment base, deliberately chosen to move away from a generic warm-cream-and-terracotta look that reads as templated.

Current design tokens (defined centrally in `main_page.css`'s `:root`, consumed by every page and shared component):

- `--cream` / `--cream-deep` — manila parchment base tones.
- `--card` / `--card-warm` — card surface tones.
- `--terracotta` (+ `--terracotta-deep` / `--terracotta-light` for gradient depth) — red soil accent.
- `--olive` — field green; promoted to a genuine second accent colour, not just a minor icon tint.
- `--gold` / `--gold-soft` — harvest gold accent.
- `--ink` / `--muted` — text tones.

Do not silently revert to the older cream/terracotta hex values from earlier README checkpoints; the token names stayed the same, only their values changed, specifically so downstream files (`bottom_nav.css`, `partners.css`) inherit the new palette automatically without needing their own edits.

### Typography

- `Noto Serif Kannada` for Kannada copy — **now actually loaded as a webfont** via a Google Fonts `<link>` in each page's `<head>`.
- `Lora` — English display/editorial voice (headlines, taglines).
- `Work Sans` — small UI text, labels, buttons.
- A shared fluid type-scale (`--fs-hero`, `--fs-tagline`, `--fs-intro`, `--fs-card-title`, `--fs-card-body`, `--fs-eyebrow`) lives in `main_page.css`'s `:root`. New or extended pages should reference these shared tokens rather than inventing one-off ranges.

### Design principles specifically adopted to avoid a generic/templated look

- Avoid a small tracked-out ALL-CAPS "eyebrow" label sitting above a heading. Status/label text should be a quieter pill instead.
- Avoid making a row of cards identical in every respect with only an icon differing — add at least a colour-accent or structural distinction per item.
- A page section that changes tone/contrast is preferred over a long flat single-tone page, to give real visual rhythm on wider screens.

### Icons

Prefer consistent inline SVG icons. Avoid mixing unrelated icon families or visual weights.

---

## 12. Survey architecture

The current homepage includes a multi-question Haveri survey.

The survey is page-specific for now and includes questions around:

- Connection to Haveri.
- Why the visitor came to OneHaveri.
- Haveri in one line.
- Haveri's strengths.
- Areas needing attention.
- Main concerns.
- Three possible changes.
- Desired future Haveri.
- Desired OneHaveri usefulness.
- Ways to contribute.
- Final thoughts.

Current survey behaviour includes:

- Multi-select options with limits where configured.
- Free-text questions.
- Other/free-text support.
- Progress indicator.
- Back/next navigation.
- Thank-you screen.
- Automatic invitation popup after a delay unless the survey has already been completed/opened.
- LocalStorage completion state.
- LocalStorage development safety copy.
- Google Apps Script submission endpoint.

Do not modify survey submission behaviour while making unrelated layout/component changes.

---

## 13. Current page-level CSS architecture

`main_page.css` owns the page-level layout and responsive foundation extracted from the original monolithic homepage styling.

This includes concepts such as:

- Root design tokens.
- Page width/height behaviour.
- Page background.
- Main page positioning.
- Dawn/background decoration.
- Shared layout geometry.
- Desktop/laptop responsive behaviour.
- Bottom spacing required for the shared bottom navigation.

Page-specific component styling that is still small and closely tied to the current working page may remain in `home_ip.html` until there is a clear reason to extract it.

The Community Portals component is now an explicit exception to keeping small portal styling inline: its shared geometry and portal-specific visual rules live under `assets/portal/css/`, with `portal_images.css` retained as the stable stylesheet entry point from the homepage.

Do not move CSS merely to satisfy a theoretical purity rule. Extract when it improves maintainability or reuse.

---

## 14. Current repository structure

At the current checkpoint the repository includes, among other existing project files:

```text
onehaveri.in/
├── index.html
├── home_ip.html
├── posts.html
├── posts.js
├── main_page.css
├── bottom_nav.css
├── bottom_nav.js
├── partners.css
├── partners.js
├── portal_images.css
├── assets/
│   └── portal/
│       ├── images/
│       │   ├── blood-bank.png
│       │   ├── skills-jobs.png
│       │   ├── schools.png
│       │   ├── community.png
│       │   └── portal-landscape.png
│       └── css/
│           ├── portal-container.css
│           ├── portal-blood-bank.css
│           ├── portal-skills-jobs.css
│           ├── portal-schools.css
│           └── portal-community.css
└── test.html
```

The repository is intentionally lightweight and does not currently use a frontend framework/build pipeline.

`posts.html` / `posts.js` are the first page built on top of the Supabase content-platform schema — see Section 25. `post.html` (the individual reading page) is designed and settled in discussion but **not yet built**.

---

## 15. `test.html`

`test.html` exists as a development/test page.

Do not assume that anything visible there is part of the production homepage.

If a test page is used to investigate a component, keep the experiment isolated and do not silently transfer experimental code into production files.

---

## 16. Navigation and future expansion

The current Navigation button is deliberately dormant.

Future navigation may eventually provide access to:

- Games/activities.
- Additional OneHaveri sections.
- Widgets.
- Other useful features.
- Future pages or panels.

The navigation architecture should eventually be able to support these without embedding all future functionality into `bottom_nav.js`.

When a future navigation system becomes real, prefer a separate navigation component/panel if its code becomes substantial.

---

## 17. Game/launcher integration plan

A game/interactive launcher already exists in the broader Snehakoota project and may be brought into OneHaveri later.

The intended approach is deliberately simple:

1. Bring the relevant `game.css` and `game.js` into the OneHaveri repository.
2. Inspect them before modifying.
3. Link them appropriately.
4. Preserve working game behaviour unless adaptation is required.
5. Change tile labels/wording to fit OneHaveri.
6. Keep game code separate from `bottom_nav.css` / `bottom_nav.js`.

Do not build a large navigation framework merely to accommodate the game launcher.

---

## 18. Content and language principles

OneHaveri is intended to be naturally bilingual where useful, with Kannada carrying much of the community-facing emotional/local expression and English used where it improves clarity or is part of a name/technical term.

Do not mechanically translate English into Kannada or make Kannada wording unnecessarily formal.

Existing Kannada copy should not be rewritten unless the owner asks for a wording change.

The tone should be:

- Mature.
- Clear.
- Inclusive.
- Human.
- Locally grounded.
- Confident without sounding aggressive.

Avoid generic promotional language.

---

## 19. Preserve existing functionality

Before changing a shared file, check its current responsibilities.

Examples of functionality that must be protected:

- Account authentication.
- Google OAuth.
- Passkey operations.
- Account signed-in/signed-out indication.
- Home navigation.
- Survey opening/closing/navigation/submission.
- Survey completion state.
- Partner rendering.
- Responsive page layout.
- Bottom navigation rendering.
- Community Portal rendering and its stable stylesheet entry point.

A visual change to one component must not accidentally remove or duplicate another component's behaviour.

---

## 20. Safe-change workflow

For meaningful repository work, use this sequence:

```text
1. Read README
        ↓
2. Inspect current repository files
        ↓
3. Identify the exact component/page involved
        ↓
4. State intended change and scope
        ↓
5. Make the smallest required change
        ↓
6. Review the actual changed file
        ↓
7. Check related shared functionality
        ↓
8. Commit with a meaningful message
        ↓
9. Report what changed / what did not change
```

For larger architectural work, divide the work into explicit phases and validate each phase before continuing.

---

## 21. What not to do

Do not:

- Turn OneHaveri into a fixed phone-size canvas.
- Add separate desktop and mobile HTML versions merely to solve layout issues.
- Put unrelated component code into `bottom_nav.js`.
- Put unrelated styling into `bottom_nav.css`.
- Put partner logic into the homepage's main JavaScript when it belongs in `partners.js`.
- Duplicate the same navigation markup on every page.
- Replace working Supabase authentication while making a visual change.
- Add unnecessary frameworks or dependencies.
- Introduce a large navigation framework before navigation is actually needed.
- Remove the dormant Navigation placeholder without an explicit design decision.
- Rebrand a partner's entire card in the partner's colours when only the wordmark is intended to borrow that treatment.
- Rewrite existing Kannada copy without request.
- Assume that a visually attractive change is safe without checking the actual shared component.
- Paste file contents into the wrong filename when manually applying AI-proposed changes into GitHub's web editor. Double-check the filename/tab showing before pasting, especially when updating several files in one sitting.
- Put portal-specific styling back into unrelated shared component files when the existing portal CSS isolation already provides a clear editing boundary.

---

## 22. Current development philosophy in one sentence

> **Build OneHaveri slowly, keep it useful and human, preserve what already works, and leave enough architectural room for the platform it may become.**

---

## 23. Future direction

The following are possibilities rather than commitments:

- Public/local information sections.
- Community contributions and posts.
- Local stories and people.
- Businesses and opportunities.
- Events.
- Public-issue reporting and follow-up.
- Useful service information.
- Games and interactive activities.
- Navigation panels/widgets.
- Authenticated contribution workflows.
- Supabase-backed data and user-generated content.

Future sessions must distinguish between **implemented functionality**, **in-progress work**, and **future ideas**. Never describe a planned feature as implemented merely because it appears in this README.

The database foundation for Supabase-backed data and user-generated content is **schema-complete and reviewed** — see Section 24. Front-end work has begun: `posts.html` (the posts list/feed) is built — see Section 25. `post.html` (the individual reading page) is fully designed in discussion but not yet built — see Section 26.

---

## 24. Supabase content-platform foundation (database layer)

**Status: database schema complete, reviewed and hardened.** This section documents the Supabase schema, access control, and review findings for the `onehaveri` project so future sessions understand what already exists before proposing a conflicting design.

### 24.1 Design principles

- No posting or data creation/change is ever allowed without the user being signed in — no anonymous writes anywhere in this schema.
- Supabase (tables, RLS, functions) is the actual source of control. The UI is a tool to read and write data, not where permissions live.
- Privileged fields — post status, moderation flags, ownership columns — are enforced server-side by triggers and never trusted from whatever the client sends.
- Behaviour toggles are stored as configuration data (`app_config`) rather than hardcoded, where practical.
- Every meaningful write is recorded in an append-only audit trail (`audit_log`) that nothing in the app — including the OWNER — can edit or delete afterward.
- Every table is designed so the next stage (a business directory, trending sorts) can be added as a new table or column, not a redesign.

### 24.2 User role hierarchy

- `role_master` — lookup of role types: `OWNER`, `ADMIN`, `BUSINESS`, `MEMBER`, each with an authority `rank`.
- `OWNER` (rank 40) and `ADMIN` (rank 30) form the real moderation ladder. `BUSINESS` and `MEMBER` intentionally share the same rank (10) — `BUSINESS` is a parallel feature-lane, not higher authority over other users.
- `user_roles` — one row per signed-up user, linked by Supabase auth UUID, never by email. A database trigger auto-assigns every new signup the `MEMBER` role. A second trigger guarantees only one `OWNER` can ever exist.
- The owner's own account has been backfilled as the sole `OWNER`.
- A "verified" flag for business-authored content lives on individual posts, decided at post-creation time — it is not stored on the user's role.

### 24.3 Config-driven behaviour

- `app_config` — a generic settings table (`config_key` / `config_value` / `data_type` / `scope`) so behaviour is controlled by a data row rather than hardcoded logic.
- Seeded so far: `grant_business_role_by_admin` (global, `true`), and `is_auto_publish_allowed` (one row per role, all currently `true`) — the latter decides whether a new post from a given role publishes immediately or sits `pending`, computed server-side at post-creation time.

### 24.4 Audit trail

- `audit_log` — a single, append-only, row-level log capturing who did what, when, and (where captured server-side) from where. Not editable or deletable through the app by anyone, including the OWNER.

### 24.5 Content taxonomy (seeded)

- `categories` — the 3 main buckets, matching the homepage's three concept cards: ಏನಾಗುತ್ತಿದೆ (What's Happening), ನಮಗೆ ಮುಖ್ಯವಾದುದು (What Matters to Us), ಕನಸುಗಳು (Dreams).
- `subcategories` — 14 seeded rows split across the 3 categories. Current wording is a first draft; a dedicated master-data edit page is planned rather than editing these by hand indefinitely.
- `tags` — 14 seeded cross-cutting labels (Politics, Sports, Travel, Food, Entertainment, Business, Education, Health, Environment, Agriculture, Technology, Jobs, Women, Youth), independent of category, meant to keep growing over time.

### 24.6 Posts and satellites (built)

- `posts` — the core content table. `status` is computed server-side from the author's role and the `is_auto_publish_allowed` config, ignoring whatever the client sends. Moderation flags and ownership fields are protected server-side. No delete — moderation is a status change.
- `post_tags` — join table linking posts to tags; managed by the post's own author or an admin.
- `comments` — `parent_comment_id` exists for future threaded replies but is unused so far.
- `reactions` — one reaction per user per post, exclusive (like OR dislike, not both).

### 24.7 Technical review findings

- Verified directly against the live database: all 11 tables have RLS enabled, correct primary/foreign keys, and every internal-only function has its direct API access revoked.
- **Fixed:** RLS policies that were re-evaluating `auth.uid()` / `current_user_rank()` on every row were rewritten using the recommended `(select ...)` pattern. No behaviour change was intended.
- **Fixed:** missing indexes on several foreign keys were added.
- **Open, needs a product decision:** `posts` / `comments` / `reactions` foreign keys to `auth.users` currently use `RESTRICT` deletion. Account-deletion handling remains a separate product decision.
- **Accepted as-is:** the single-OWNER rule has a theoretical concurrent-transaction race, but OWNER assignment is manually controlled.

### 24.8 Error / response handling standard

- Supabase's API layer returns standard JSON for success/failure.
- Custom validation is raised via `RAISE EXCEPTION` inside trigger functions and reaches the client as a standard API error.
- If a future write genuinely needs server-generated warnings, use a purpose-built RPC response rather than expecting Postgres `NOTICE`/`WARNING` messages to reach the browser.

### 24.9 Do not

- Do not create new role, category, subcategory or tag values ad hoc in code; extend the corresponding Supabase table instead.
- Do not treat historical `app_config` seed entries as the live source of truth where a dedicated table is authoritative.
- Do not design a posting UI that allows anonymous writes.
- Do not assume a user's Supabase account can be deleted while dependent content still exists; the current foreign-key policy prevents that.

### 24.10 Schema additions made after the original technical review (2026-09-04 to 2026-09-08)

- **`user_roles.status`** (`pending` / `active` / `suspended`) added, with default status controlled by `app_config`. `current_user_rank()` returns `0` for non-active roles so creation of new posts/comments/reactions/tags is gated consistently.
- **`posts.author_display_name`** added and derived server-side from user metadata at post creation, then frozen.
- **Pagination index corrected:** `idx_posts_status_published` now includes `id desc` as a deterministic cursor tiebreaker.
- A production incident involving accidental CSS content in `bottom_nav.js` was found and fixed by restoring the JavaScript.

---

## 25. `posts.html` — posts list / feed (built)

**Status: built and structurally verified. Not yet linked from the homepage or bottom navigation** — reachable only by its own URL for now.

### 25.1 Architecture

- `posts.html` — markup and page-specific styles.
- `posts.js` — data-fetching and rendering, organised as CONFIG → DATA LAYER → UTIL → RENDER LAYER → STATE → INIT/EVENTS.
- Uses its own Supabase client instance (`sbPosts`) with names distinct from the bottom navigation globals.

### 25.2 Settled v1 behaviour

- Lands on **ಎಲ್ಲಾ** by default.
- Category filtering is client-side state only for v1.
- An empty category falls back to recent-across-all; a genuinely empty database shows an honest empty state.
- Tiles show title, short excerpt and relative posted date only.
- Excerpt truncation is whitespace-aware and avoids arbitrary Kannada character slicing.
- Pagination is cursor/keyset-based with an explicit **Load more** button.
- Errors stay on the page with a retry action.
- A signed-in author's own non-published posts appear in a separate section.
- `+ write` and a dedicated "my posts" page remain out of scope for v1.

### 25.3 Verification

Rendered and tested locally for structure, styling and failure-path behaviour before handoff. A real redeclaration bug and a CSS specificity issue affecting the `hidden` attribute were found and fixed. Live Supabase data fetching still needs confirmation against the deployed site where network access is available.

---

## 26. `post.html` — individual post reading page (designed, not yet built)

**Status: fully settled in discussion. No file exists yet.**

- A separate real page (`post.html?id=...`) is preferred over a same-page panel so shared links, refresh and bookmarks work naturally.
- Internally modular by named regions so future panels can be added without disturbing existing regions.
- Author-edit controls are based on comparing the post author with the signed-in user's id.
- Admin/moderation controls are based on the signed-in user's role, fetched once per session and cached.
- v1 feature staging: visible-but-inert Like shell, read-only Comments, Related Posts placeholder, and copy-link Share.
- Not-found/no-access uses a generic message rather than distinguishing those cases.
- An explicit back-to-posts link is always present.

Snapshot-image sharing, read-aloud, translated audio and server-side video export remain future ideas rather than current implementation.

---

## 27. Recent progress since the previous README checkpoint (2026-09-09 → 2026-10-01)

This section is intentionally a **delta record**. Earlier README history is retained above; future tools/persons should add new work here or update the relevant current-state section rather than rewriting historical decisions.

### 27.1 Community Portals homepage module

The in-progress homepage now contains a **Community Portals** module intended as a compact entry point for useful Haveri-facing services and initiatives.

Current portal slots:

- **Blood Bank Portal**
- **Skills & Jobs**
- **Schools & Education**
- **Community Initiatives**

A Haveri landscape artwork is used as the shared visual treatment for the portal area. The section was also compacted so it remains useful without consuming excessive vertical space, particularly on smaller screens.

### 27.2 Portal artwork assets

Portal artwork is now stored under:

```text
assets/portal/images/
├── blood-bank.png
├── skills-jobs.png
├── schools.png
├── community.png
└── portal-landscape.png
```

The repository also contains the directory placeholder used before the artwork was added. The current implementation uses the PNG assets rather than relying on the older inline SVG artwork for the portal visuals.

### 27.3 Portal CSS modularisation

The portal component was deliberately modularised without introducing a generic data-driven renderer or unnecessary JavaScript.

The stable homepage stylesheet entry point is:

- `portal_images.css`

It imports:

- `assets/portal/css/portal-container.css` — shared portal container/grid/card geometry, responsive behaviour and common artwork treatment.
- `assets/portal/css/portal-blood-bank.css` — Blood Bank-specific styling and artwork mapping.
- `assets/portal/css/portal-skills-jobs.css` — Skills & Jobs-specific styling and artwork mapping.
- `assets/portal/css/portal-schools.css` — Schools & Education-specific styling and artwork mapping.
- `assets/portal/css/portal-community.css` — Community Initiatives-specific styling and artwork mapping.

Each portal's CSS is scoped to that portal's card. This establishes a clear editing boundary: changing one portal's accent, tint, artwork or visual details should not require editing the other portal styles.

### 27.4 Portal JavaScript decision

No portal-specific JavaScript was added in this phase because the current portals do not require interactive behaviour beyond normal links/presentation.

If a portal later needs actual behaviour, its JavaScript should be isolated to that portal rather than adding unrelated logic to shared homepage or bottom-navigation code.

### 27.5 Legacy portal styling boundary

The modular CSS layer was added conservatively to avoid a risky rewrite of `home_ip.html`. Existing inline portal CSS remains in the working page as a legacy baseline, while the new external rules take ownership of the portal-specific visual layer. Legacy inline SVG artwork is suppressed for the portal artwork slots so the new PNG assets are the active visual source.

This is intentional: the current boundary is modular and safe, but a future cleanup may physically remove obsolete inline portal CSS once the rendered behaviour has been independently verified and there is a reason to do so.

### 27.6 Verification status for this delta

Source-level verification was performed against the repository after the portal modularisation:

- Correct repository: `theshivu-dev/onehaveri.in`, branch `main`.
- All four portal CSS files exist and are referenced through `portal_images.css`.
- All five portal PNG assets exist.
- Each portal-specific stylesheet maps only to its own portal artwork.
- Shared container CSS owns common responsive/card geometry and the landscape artwork.
- Legacy SVG portal artwork is hidden by the new artwork rules.
- `home_ip.html` continues to reference the stable `portal_images.css` entry point.

No browser/live rendered verification was performed during this delta; visual confirmation against the deployed page remains a separate check.

### 27.7 Working principle established by this change

For the small, known set of Community Portals, prefer **explicit per-portal CSS boundaries over an over-engineered generic renderer**. Share only genuine common geometry/responsive rules. Keep portal-specific presentation isolated. Add portal-specific JS only when a portal actually needs behaviour.

---

## 28. Handover rule for future contributors

When continuing OneHaveri work:

1. Read this README first.
2. Check the current repository state rather than assuming this document is newer than the code.
3. Pay particular attention to the **Recent progress** section for changes made after the previous README checkpoint.
4. If another tool/person has changed the repository since this README was updated, inspect the current files and append only the missing delta.
5. Do not delete historical decisions merely because a newer implementation exists; update the relevant current-state section and preserve useful reasoning where it helps prevent regressions.
6. Do not claim browser, deployment, Supabase or other verification unless it was actually performed.

> **The repository is the implementation source of truth; this README is the shared high-level engineering memory and handover record.**
