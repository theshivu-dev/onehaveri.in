.onehaveri-bottom-nav {
  position: fixed;
  left: 50%;
  bottom: max(18px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 800;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: rgba(255, 252, 245, 0.96);
  border: 1px solid rgba(59, 42, 30, 0.10);
  border-radius: 999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow:
    0 6px 20px rgba(59, 42, 30, 0.12),
    0 2px 8px rgba(59, 42, 30, 0.06);
  transition: opacity .2s ease, visibility .2s ease, transform .2s ease;
}

.onehaveri-bottom-nav a {
  position: relative;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #6D5946;
  border-radius: 50%;
  transition: background .2s ease, color .2s ease;
}

.onehaveri-bottom-nav a:hover {
  background: rgba(176, 69, 43, 0.06);
}

.onehaveri-bottom-nav a.active {
  color: #B0452B;
  background: rgba(176, 69, 43, 0.10);
}

.onehaveri-bottom-nav svg {
  width: 22px;
  height: 22px;
}

.onehaveri-bottom-nav a .icon-filled {
  display: none;
}

.onehaveri-bottom-nav a.active .icon-outline {
  display: none;
}

.onehaveri-bottom-nav a.active .icon-filled {
  display: block;
}

body.survey-is-open .onehaveri-bottom-nav {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 480px) {
  .onehaveri-bottom-nav {
    gap: 4px;
    padding: 6px;
  }
  .onehaveri-bottom-nav a {
    width: 42px;
    height: 42px;
  }
  .onehaveri-bottom-nav svg {
    width: 20px;
    height: 20px;
  }
}
