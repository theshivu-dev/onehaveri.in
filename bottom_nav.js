document.addEventListener("DOMContentLoaded", () => {

    const nav = document.createElement("nav");
    nav.className = "onehaveri-bottom-nav";

    nav.innerHTML = `

        /
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 10L12 3L21 10"></path>
                <path d="M5 10V20H19V10"></path>
            </svg>
        </a>

        /new-post.html
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5V19"></path>
                <path d="M5 12H19"></path>
            </svg>
        </a>

        /profile.html
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 20C4 16 7 14 12 14C17 14 20 16 20 20"></path>
            </svg>
        </a>

    `;

    document.body.appendChild(nav);

});
