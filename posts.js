/* ==================================================================
   OneHaveri -- Posts List (data layer + render layer)
   ------------------------------------------------------------------
   Kept in its own file, separate from posts.html's markup, so the
   page structure and this behaviour can each be changed without
   touching the other. Internally still split into clear sections:
   CONFIG -> DATA -> RENDER -> UTIL -> STATE -> INIT/EVENTS.

   This file only ever reads from Supabase. Nothing here writes.
   ================================================================== */

/* ---------------- CONFIG ---------------- */
// Named distinctly from bottom_nav.js's own SUPABASE_URL/SUPABASE_KEY --
// both files load as plain scripts sharing one global scope, so reusing
// those exact names would crash with a redeclaration error.
const POSTS_SUPABASE_URL = "https://zdgbtjelxhriggjavecp.supabase.co";
const POSTS_SUPABASE_KEY = "sb_publishable_G2vSbiWDeNBPcJCQb0GEUg_S9GvaCVO";
const PAGE_SIZE = 10;

// Category accent colours, matching the homepage's existing card treatment.
const CATEGORY_ACCENT = {
  "whats-happening": "var(--terracotta)",
  "what-matters-to-us": "var(--olive)",
  "dreams": "var(--gold)"
};

let sbPosts = null;
try {
  sbPosts = window.supabase.createClient(POSTS_SUPABASE_URL, POSTS_SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
} catch (err) {
  console.error("Supabase client failed to initialise:", err);
}

/* ---------------- DATA LAYER ----------------
   Pure fetch functions. Return plain data, know nothing about the DOM. */

async function fetchPublishedPosts({ categorySlug, cursor, pageSize }) {
  let query = sbPosts
    .from("posts")
    .select("id, title, body, published_at, author_display_name, categories!inner(slug, name_en, name_kn)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1); // fetch one extra to know if another page exists

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  if (cursor) {
    // Keyset pagination on (published_at, id) -- matches idx_posts_status_published.
    query = query.or(
      `published_at.lt.${cursor.published_at},and(published_at.eq.${cursor.published_at},id.lt.${cursor.id})`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  const hasMore = data.length > pageSize;
  const page = hasMore ? data.slice(0, pageSize) : data;
  const nextCursor = page.length
    ? { published_at: page[page.length - 1].published_at, id: page[page.length - 1].id }
    : null;

  return { posts: page, hasMore, nextCursor };
}

async function fetchOwnPendingPosts(userId) {
  const { data, error } = await sbPosts
    .from("posts")
    .select("id, title, body, status, created_at, categories(slug, name_en, name_kn)")
    .eq("author_id", userId)
    .neq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/* ---------------- UTIL ----------------
   Shared, space-aware excerpt builder -- also the intended reuse point
   for the future snapshot-image share feature, so both stay in sync. */

function buildExcerpt(text, targetLen = 20, maxExtra = 20) {
  if (!text) return "";
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= targetLen) return clean;

  const hardLimit = targetLen + maxExtra;
  const windowSlice = clean.slice(0, hardLimit);

  let breakAt = -1;
  for (let i = targetLen; i < windowSlice.length; i++) {
    if (/\s/.test(windowSlice[i])) { breakAt = i; break; }
  }

  let result = breakAt !== -1 ? clean.slice(0, breakAt) : clean.slice(0, hardLimit);
  result = result.replace(/[\s,;:.!?—-]+$/u, "");
  return result + "…";
}

function formatRelativeDate(isoString) {
  if (!isoString) return "";
  const then = new Date(isoString);
  const diffMs = Date.now() - then.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays <= 0) return "ಇಂದು";
  if (diffDays === 1) return "ನಿನ್ನೆ";
  if (diffDays < 7) return `${diffDays} ದಿನಗಳ ಹಿಂದೆ`;
  return then.toLocaleDateString("kn-IN", { day: "numeric", month: "short", year: "numeric" });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

/* ---------------- RENDER LAYER ----------------
   Takes plain data, produces DOM. Knows nothing about Supabase. */

function tileHtml(post) {
  const slug = post.categories ? post.categories.slug : "";
  const accent = CATEGORY_ACCENT[slug] || "var(--terracotta)";
  const excerpt = buildExcerpt(post.body);
  return `
    <a class="tile" style="--ac:${accent}" href="post.html?id=${encodeURIComponent(post.id)}">
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(excerpt)}</p>
      <div class="tile-date">${formatRelativeDate(post.published_at)}</div>
    </a>`;
}

function renderPosts(posts, { append } = {}) {
  const list = document.getElementById("postsList");
  const html = posts.map(tileHtml).join("");
  if (append) list.insertAdjacentHTML("beforeend", html);
  else list.innerHTML = html;
}

function renderOwnPending(posts) {
  const section = document.getElementById("ownPendingSection");
  const list = document.getElementById("ownPendingList");
  if (!posts.length) { section.hidden = true; return; }
  list.innerHTML = posts.map(tileHtml).join("");
  section.hidden = false;
}

function showState(message, { showRetry } = {}) {
  const el = document.getElementById("postsState");
  el.hidden = false;
  el.innerHTML = message + (showRetry ? `<div><button class="retry-btn" id="retryBtn">ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ</button></div>` : "");
  if (showRetry) document.getElementById("retryBtn").addEventListener("click", loadFirstPage);
}

function hideState() {
  document.getElementById("postsState").hidden = true;
}

/* ---------------- STATE ---------------- */
// A homepage category card links here as posts.html?category=<slug> -- this
// is a one-way *entry* parameter, read once on load. It is deliberately not
// the same thing as reflecting in-page tab clicks into the URL (which we
// decided against for v1) -- this only decides where the page starts.
const VALID_CATEGORIES = ["whats-happening", "what-matters-to-us", "dreams"];
const incomingCategory = new URLSearchParams(window.location.search).get("category");
let currentCategory = VALID_CATEGORIES.includes(incomingCategory) ? incomingCategory : "";
let currentCursor = null;
let currentHasMore = false;

/* ---------------- INIT / EVENTS ---------------- */

async function loadFirstPage() {
  hideState();
  document.getElementById("postsList").innerHTML = "";
  document.getElementById("loadMoreBtn").hidden = true;

  if (!sbPosts) {
    showState("ಏನೋ ತಪ್ಪಾಗಿದೆ.", { showRetry: true });
    return;
  }

  showState("ಲೋಡ್ ಆಗುತ್ತಿದೆ…");

  try {
    const { posts, hasMore, nextCursor } = await fetchPublishedPosts({
      categorySlug: currentCategory,
      cursor: null,
      pageSize: PAGE_SIZE
    });

    currentCursor = nextCursor;
    currentHasMore = hasMore;

    if (!posts.length) {
      if (currentCategory) {
        // Empty category -> fall back to showing recent posts across all categories.
        currentCategory = "";
        document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.category === ""));
        return loadFirstPage();
      }
      hideState();
      showState("ಇಲ್ಲಿ ಇನ್ನೂ ಏನೂ ಇಲ್ಲ.");
      return;
    }

    hideState();
    renderPosts(posts);
    document.getElementById("loadMoreBtn").hidden = !hasMore;
  } catch (err) {
    console.error("Posts feed load failed:", err);
    hideState();
    showState("ಏನೋ ತಪ್ಪಾಗಿದೆ.", { showRetry: true });
  }
}

async function loadMore() {
  const btn = document.getElementById("loadMoreBtn");
  btn.disabled = true;
  btn.textContent = "ಲೋಡ್ ಆಗುತ್ತಿದೆ…";

  try {
    const { posts, hasMore, nextCursor } = await fetchPublishedPosts({
      categorySlug: currentCategory,
      cursor: currentCursor,
      pageSize: PAGE_SIZE
    });
    currentCursor = nextCursor;
    currentHasMore = hasMore;
    renderPosts(posts, { append: true });
    btn.hidden = !hasMore;
  } catch (err) {
    console.error("Load more failed:", err);
    // Leave existing posts on screen; just let them try the button again.
  } finally {
    btn.disabled = false;
    btn.textContent = "ಇನ್ನಷ್ಟು ▾";
  }
}

async function loadOwnPending() {
  if (!sbPosts) return;
  try {
    const { data: { session } } = await sbPosts.auth.getSession();
    if (!session) return;
    const pending = await fetchOwnPendingPosts(session.user.id);
    renderOwnPending(pending);
  } catch (err) {
    // Non-critical -- if this fails, the main feed still works fine.
    console.error("Own pending posts check failed:", err);
  }
}

document.getElementById("catTabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  currentCategory = btn.dataset.category;
  loadFirstPage();
});

document.getElementById("loadMoreBtn").addEventListener("click", loadMore);

// Reflect an incoming ?category= in the tab UI before the first fetch,
// so the matching tab shows active immediately rather than defaulting
// to "ಎಲ್ಲಾ" and then silently filtering underneath it.
if (currentCategory) {
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.category === currentCategory);
  });
}

loadFirstPage();
loadOwnPending();
