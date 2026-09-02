# OneHaveri.in — Project Rules & Development Standards

> **Last updated:** 2026-09-02
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

The current repository contains both pages and, at the latest checkpoint, they have the same file size/SHA in the repository.

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

6. **Bottom navigation**
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

Current example:

- `main_page.css` → homepage/page-level layout and shared visual tokens.
- `home_ip.html` → page markup and page-specific content/logic that has not yet justified extraction.

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

`bottom_nav.css` and `bottom_nav.js` are specific to the bottom navigation component. Do not place unrelated homepage/game/partner logic there.

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

The established homepage visual direction is warm, restrained and community-oriented.

Current design tokens include:

- Warm cream background.
- Cream/deep-cream card surfaces.
- Gold/gold-soft accents.
- Terracotta accent.
- Dark brown/ink text.
- Muted brown secondary text.
- Olive accent where appropriate.
- Soft borders.
- Rounded cards.
- Subtle shadows rather than heavy UI effects.

The design should feel human, mature and local rather than like a generic dashboard or AI-generated template.

### Typography

Kannada content should remain readable and natural. Existing Kannada typography uses appropriate system/Kannada serif fallbacks such as:

- `Noto Serif Kannada`
- `Nirmala UI`
- `Tunga`

Do not arbitrarily replace established typography.

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

Do not move CSS merely to satisfy a theoretical purity rule. Extract when it improves maintainability or reuse.

---

## 14. Current repository structure

At the current checkpoint the repository includes:

```text
onehaveri.in/
├── index.html
├── home_ip.html
├── main_page.css
├── bottom_nav.css
├── bottom_nav.js
├── partners.css
├── partners.js
└── test.html
```

The repository is intentionally lightweight and does not currently use a frontend framework/build pipeline.

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

The database foundation for "Supabase-backed data and user-generated content" above is now **schema-complete and reviewed** — see Section 24. Front-end work (post-creation and post-viewing pages) is the next phase; no such UI exists in this repository yet.

---

## 24. Supabase content-platform foundation (database layer)

**Status: database schema complete, reviewed and hardened. No corresponding UI exists yet** — no HTML, CSS or JavaScript exists for creating or browsing posts. This section documents the full Supabase schema, access control, and review findings for the `onehaveri` project, so future sessions understand what already exists before proposing a conflicting design.

### 24.1 Design principles

- No posting or data creation/change is ever allowed without the user being signed in — no anonymous writes anywhere in this schema.
- Supabase (tables, RLS, functions) is the actual source of control. The UI is a tool to read and write data, not where permissions live.
- Privileged fields — post status, moderation flags, ownership columns — are enforced server-side by triggers and never trusted from whatever the client sends.
- Behaviour toggles are stored as configuration data (`app_config`) rather than hardcoded, where practical.
- Every meaningful write is recorded in an append-only audit trail (`audit_log`) that nothing in the app — including the OWNER — can edit or delete afterward.
- Every table is designed so the next stage (a business directory, trending sorts) can be added as a new table or column, not a redesign.

### 24.2 User role hierarchy

- `role_master` — lookup of role types: `OWNER`, `ADMIN`, `BUSINESS`, `MEMBER`, each with an authority `rank`.
- `OWNER` (rank 40) and `ADMIN` (rank 30) form the real moderation ladder. `BUSINESS` and `MEMBER` intentionally share the same rank (10) — `BUSINESS` is a parallel feature-lane (future business/institute pages), not higher authority over other users.
- `user_roles` — one row per signed-up user, linked by Supabase auth UUID, never by email. A database trigger auto-assigns every new signup the `MEMBER` role. A second trigger guarantees only one `OWNER` can ever exist.
- The owner's own account has been backfilled as the sole `OWNER`.
- A "verified" flag for business-authored content lives on individual posts, decided at post-creation time — it is not stored on the user's role.

### 24.3 Config-driven behaviour

- `app_config` — a generic settings table (config_key / config_value / data_type / scope) so behaviour is controlled by a data row rather than hardcoded logic.
- Seeded so far: `grant_business_role_by_admin` (global, `true`), and `is_auto_publish_allowed` (one row per role, all currently `true`) — the latter decides whether a new post from a given role publishes immediately or sits `pending`, computed server-side at post-creation time.

### 24.4 Audit trail

- `audit_log` — a single, append-only, row-level log capturing who did what, when, and (where captured server-side) from where. Not editable or deletable through the app by anyone, including the OWNER.

### 24.5 Content taxonomy (seeded)

- `categories` — the 3 main buckets, matching the homepage's three concept cards: ಏನಾಗುತ್ತಿದೆ (What's Happening), ನಮಗೆ ಮುಖ್ಯವಾದುದು (What Matters to Us), ಕನಸುಗಳು (Dreams).
- `subcategories` — 14 seeded rows split across the 3 categories. Current wording is a first draft; a dedicated master-data edit page is planned rather than editing these by hand indefinitely.
- `tags` — 14 seeded cross-cutting labels (Politics, Sports, Travel, Food, Entertainment, Business, Education, Health, Environment, Agriculture, Technology, Jobs, Women, Youth), independent of category, meant to keep growing over time.

### 24.6 Posts and satellites (built)

- `posts` — the core content table. `status` (draft/pending/published/rejected/hidden) is computed server-side from the author's role and the `is_auto_publish_allowed` config, ignoring whatever the client sends. `is_featured`/`is_promoted` can only be set true by ADMIN/OWNER. `is_verified` can only be true for a BUSINESS-role author, or by ADMIN/OWNER override. `author_id`/`created_by`/`updated_by` are forced server-side and frozen after creation. No delete — moderation is a status change.
- `post_tags` — join table linking posts to tags; managed by the post's own author or an admin.
- `comments` — `parent_comment_id` exists for future threaded replies but is unused so far. An author can self-hide their own comment; any other status change is admin-only.
- `reactions` — one reaction per user per post, exclusive (like OR dislike, not both). Unlike every other table here, real deletion is allowed — unliking is a normal, revocable action, not something needing a permanent trace.

### 24.7 Technical review findings (this session)

- Verified directly against the live database: all 11 tables have RLS enabled, correct primary/foreign keys, and every internal-only function has its direct API access revoked.
- **Fixed:** several RLS policies were re-evaluating `auth.uid()`/`current_user_rank()` on every row instead of once per query; rewritten using Postgres/Supabase's recommended `(select ...)` pattern. No behaviour changed, only planning efficiency.
- **Fixed:** added missing indexes on several foreign keys that had none (`comments.author_id`, `posts.created_by`/`updated_by`/`subcategory_id`, `reactions.user_id`, `user_roles.role_id`/`assigned_by`).
- **Open, needs a product decision (not fixed):** `posts`/`comments`/`reactions` foreign keys to `auth.users` currently `RESTRICT` deletion — **a Supabase account cannot be deleted at all once it has posted, commented, or reacted.** The owner is planning this separately (e.g. reassignment/anonymization on account deletion) as a product decision rather than a schema patch made ad hoc here.
- **Noted, accepted as-is (low real-world risk):** the single-OWNER rule uses a count-based trigger check, which has a theoretical concurrent-transaction race condition. Given this role is only ever granted manually by the owner (not a public signup race), this is accepted rather than hardened further.
- **Noted:** the real "backup owner" path is the owner's own access to the Supabase project itself (outside the app), which always bypasses RLS — a separate continuity plan (who else can access the Supabase project if needed) is being considered by the owner as a product matter, not a schema change.

### 24.8 Error / response handling standard

- Supabase's API layer (PostgREST) returns standard JSON for every request: success returns the affected row(s); failure returns `message`, `details`, `hint`, and a Postgres SQLSTATE `code` (e.g. `23505` for a duplicate key; an RLS-denied write is rejected automatically with no custom code needed).
- Custom validation (e.g. "author_id cannot be changed") is raised via `RAISE EXCEPTION` inside trigger functions and reaches the client the same way, under the generic custom-exception code `P0001`. This is standard practice and sufficient for now. If the UI later needs to branch its behaviour differently per error type, distinct SQLSTATEs can be introduced at that point — not needed today.
- Postgres's `NOTICE`/`WARNING` levels exist but are **not** forwarded to API clients — only `EXCEPTION` reaches the front end as an error; notices only go to server logs. There is currently no "this saved, but here's a warning" response from a plain table write. If that's ever genuinely needed (a warning that depends on server-side knowledge the client doesn't have — not client-side form validation, which needs no round-trip at all), the pattern is to route that specific write through an RPC function returning a custom shape like `{ data, warnings }` instead of a plain table insert. Not used anywhere in this schema yet, since no current write path needs it.

### 24.9 Do not

- Do not create new role, category, subcategory or tag values ad hoc in code; extend the corresponding Supabase table instead.
- Do not treat `app_config`'s `main_categories` entry as a live source of truth — it is a historical record of the original seed; `categories` itself is authoritative once seeded.
- Do not design a posting UI that allows anonymous writes; sign-in is a hard requirement enforced at the database level.
- Do not assume a user's Supabase account can be deleted while they have posts/comments/reactions — it currently cannot, by design of the foreign keys, pending the owner's product decision on account-deletion handling.
