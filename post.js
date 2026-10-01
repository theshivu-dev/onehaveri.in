/* ==================================================================
   OneHaveri -- Post Reading Page (data layer + render layer)
   ------------------------------------------------------------------
   Independently modular from posts.js -- the only connection between
   the two pages is the ?id= in the URL. This file does not know
   posts.js exists, and posts.js does not know this file exists.

   Sectioned exactly like posts.js: CONFIG -> DATA LAYER -> UTIL ->
   RENDER LAYER -> STATE -> INIT/EVENTS.

   This file only ever reads from Supabase. Nothing here writes.
   ================================================================== */

/* ---------------- CONFIG ---------------- */
// Named distinctly from bottom_nav.js's (SUPABASE_URL/SUPABASE_KEY/sb) and
// posts.js's (POSTS_SUPABASE_URL/POSTS_SUPABASE_KEY/sbPosts) own constants --
// all these files load as plain scripts sharing one global scope, so
// reusing any of those exact names would crash with a redeclaration error.
const POST_SUPABASE_URL = "https://zdgbtjelxhriggjavecp.supabase.co";
const POST_SUPABASE_KEY = "sb_publishable_G2vSbiWDeNBPcJCQb0GEUg_S9GvaCVO";

// Category accent colours, matching posts.js's own tile treatment.
const CATEGORY_ACCENT = {
  "whats-happening": "var(--terracotta)",
  "what-matters-to-us": "var(--olive)",
  "dreams": "var(--gold)"
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let sbPost = null;
try {
  sbPost = window.supabase.createClient(POST_SUPABASE_URL, POST_SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
} catch (err) {
  console.error("Supabase client failed to initialise:", err);
}

/* ---------------- DATA LAYER ----------------
   Pure fetch functions. Return plain data, know nothing about the DOM. */

async function fetchPost(id) {
  const { data, error } = await sbPost
    .from("posts")
    .select("id, title, body, author_id, author_display_name, published_at, status, categories!inner(slug, name_en, name_kn), subcategories(name_en, name_kn), post_tags(tags(slug, name_en, name_kn))")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data; // null if not found or RLS-denied -- both look identical from here, by design
}

async function fetchComments(postId) {
  const { data, error } = await sbPost
    .from("comments")
    .select("id, body, created_at, author_id")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

/* ---------------- UTIL ---------------- */

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
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

/* ---------------- RENDER LAYER ----------------
   Takes plain data, produces DOM. Knows nothing about Supabase. */

function renderPost(post) {
  const main = document.getElementById("postMain");

  const slug = post.categories ? post.categories.slug : "";
  main.style.setProperty("--ac", CATEGORY_ACCENT[slug] || "var(--terracotta)");

  const catName = post.categories ? (post.categories.name_kn || post.categories.name_en) : "";
  const subName = post.subcategories ? (post.subcategories.name_kn || post.subcategories.name_en) : "";
  document.getElementById("postChipRow").innerHTML =
    `<span class="post-chip">${escapeHtml(catName)}${subName ? " · " + escapeHtml(subName) : ""}</span>`;

  document.getElementById("postTitle").textContent = post.title;

  const displayName = post.author_display_name || "ಸದಸ್ಯರು";
  document.getElementById("postAvatar").textContent = displayName.trim().charAt(0).toUpperCase();
  document.getElementById("postAuthorName").textContent = displayName;
  document.getElementById("postAuthorDate").textContent = formatRelativeDate(post.published_at);

  document.getElementById("postBody").innerHTML = post.body
    .split(/\n{2,}/)
    .map(para => `<p>${escapeHtml(para.trim())}</p>`)
    .join("");

  const tags = (post.post_tags || []).map(pt => pt.tags).filter(Boolean);
  const tagsRow = document.getElementById("postTagsRow");
  if (tags.length) {
    tagsRow.hidden = false;
    tagsRow.innerHTML = tags.map(t => `<span class="post-tag-chip">${escapeHtml(t.name_kn || t.name_en)}</span>`).join("");
  } else {
    tagsRow.hidden = true;
  }

  // Author-edit: cheap local comparison against the signed-in session, no extra query.
  const editLink = document.getElementById("editLink");
  if (currentUserId && currentUserId === post.author_id) {
    editLink.hidden = false;
    editLink.href = `write.html?edit=${encodeURIComponent(post.id)}`; // write.html does not exist yet
  } else {
    editLink.hidden = true;
  }

  main.hidden = false;
}

function renderComments(comments) {
  const region = document.getElementById("commentsRegion");
  const list = document.getElementById("commentsList");
  region.hidden = false;

  if (!comments.length) {
    list.innerHTML = `<div class="comments-empty">ಇನ್ನೂ ಯಾವುದೇ ಕಾಮೆಂಟ್‌ಗಳಿಲ್ಲ.</div>`;
    return;
  }

  // NOTE: comments has no author_display_name column (unlike posts) -- there
  // is currently no way to resolve a comment's author_id into a real name
  // without querying auth.users, which isn't accessible from the client.
  // Using a generic placeholder deliberately rather than showing nothing or
  // guessing. See KT notes: this needs the same fix posts.author_display_name
  // already solved, applied to comments, whenever that's decided on.
  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-author">ಸದಸ್ಯರು</div>
      <div class="comment-body">${escapeHtml(c.body)}</div>
      <div class="comment-date">${formatRelativeDate(c.created_at)}</div>
    </div>`).join("");
}

function showLoading() {
  const el = document.getElementById("postState");
  el.hidden = false;
  el.innerHTML = "ಲೋಡ್ ಆಗುತ್ತಿದೆ…";
}

function showNotFound() {
  const el = document.getElementById("postState");
  el.hidden = false;
  el.innerHTML = `
    <div>ಈ ಪೋಸ್ಟ್ ಸಿಗಲಿಲ್ಲ.</div>
    <div style="margin-top:12px"><a class="back-link" href="posts.html">← ಎಲ್ಲಾ ಪೋಸ್ಟ್‌ಗಳಿಗೆ ಹಿಂತಿರುಗಿ</a></div>`;
}

function showError() {
  const el = document.getElementById("postState");
  el.hidden = false;
  el.innerHTML = `
    <div>ಏನೋ ತಪ್ಪಾಗಿದೆ.</div>
    <div><button type="button" class="retry-btn" id="retryBtn">ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ</button></div>`;
  document.getElementById("retryBtn").addEventListener("click", loadPost);
}

function hideState() {
  document.getElementById("postState").hidden = true;
}

/* ---------------- STATE ---------------- */
const postId = new URLSearchParams(window.location.search).get("id");
let currentUserId = null;

/* ---------------- INIT / EVENTS ---------------- */

async function initSession() {
  if (!sbPost) return;
  try {
    const { data: { session } } = await sbPost.auth.getSession();
    currentUserId = session ? session.user.id : null;
  } catch (err) {
    console.error("Session check failed:", err);
  }
}

async function loadComments() {
  try {
    const comments = await fetchComments(postId);
    renderComments(comments);
  } catch (err) {
    // Non-critical -- comments failing to load should never take down the
    // main reading experience above it.
    console.error("Comments load failed:", err);
  }
}

async function loadPost() {
  hideState();
  document.getElementById("postMain").hidden = true;
  document.getElementById("commentsRegion").hidden = true;

  if (!sbPost) {
    showError();
    return;
  }

  if (!postId || !UUID_RE.test(postId)) {
    showNotFound();
    return;
  }

  showLoading();

  try {
    const post = await fetchPost(postId);
    if (!post) {
      showNotFound();
      return;
    }
    hideState();
    renderPost(post);
    loadComments();
  } catch (err) {
    console.error("Post load failed:", err);
    showError();
  }
}

async function handleShare() {
  const url = window.location.href;
  const btn = document.getElementById("shareBtn");

  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
    } catch (err) {
      // User cancelled the native share sheet -- not worth logging as an error.
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    const original = btn.textContent;
    btn.textContent = "ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ ✓";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = original; btn.classList.remove("copied"); }, 2000);
  } catch (err) {
    console.error("Copy to clipboard failed:", err);
  }
}

document.getElementById("shareBtn").addEventListener("click", handleShare);

(async function init() {
  await initSession();
  await loadPost();
})();
