document.addEventListener("DOMContentLoaded", () => {

  const links = [
    {
      href: "/",
      label: "Home",
      // TODO: return true when this really is the OneHaveri landing/home page
      isActive: function () {
        return false;
      },
      outline: `<path d="M3 10.5 12 3l9 7.5"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>`,
      filled: `<path fill="currentColor" d="M12 2.5 2.5 10.3V21a1 1 0 0 0 1 1H9v-7h6v7h5.5a1 1 0 0 0 1-1V10.3L12 2.5Z"/>`
    },
    {
      href: "/new-post.html",
      label: "New post",
      // TODO: return true when the new-post page/panel is actually open
      isActive: function () {
        return false;
      },
      outline: `<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M12 8v8M8 12h8"/>`,
      filled: `<rect x="4" y="4" width="16" height="16" rx="5" fill="currentColor"/><path d="M12 8v8M8 12h8" stroke="#FFFCF5" stroke-width="2" stroke-linecap="round"/>`
    },
    {
      href: "/profile.html",
      label: "Profile",
      // TODO: return true when viewing the profile page, or the account panel is open
      isActive: function () {
        return false;
      },
      outline: `<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3-6 8-6s8 2 8 6"/>`,
      filled: `<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c0-4 3-6 8-6s8 2 8 6" fill="currentColor"/>`
    }
  ];

  const nav = document.createElement("nav");
  nav.className = "onehaveri-bottom-nav";

  nav.innerHTML = links.map(link => {
    const isActive = link.isActive();
    return `
      <a href="${link.href}" aria-label="${link.label}" class="${isActive ? "active" : ""}">
        <svg class="icon-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${link.outline}</svg>
        <svg class="icon-filled" viewBox="0 0 24 24">${link.filled}</svg>
      </a>
    `;
  }).join("");

  document.body.appendChild(nav);

});
