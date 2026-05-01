(() => {
  const root = document.documentElement;
  const button = document.querySelector(".docs-nav-toggle");
  const sidebar = document.getElementById("docs-sidebar");
  const nav = sidebar?.querySelector(".docs-nav");

  if (!button || !sidebar) {
    return;
  }

  const storageKey = "haku-docs-nav-state";
  const scrollKey = "haku-docs-nav-scroll";
  const desktopQuery = window.matchMedia("(min-width: 1180px)");
  const labels = {
    open: "折叠目录",
    closed: "展开目录",
  };

  const getDefaultState = () => (desktopQuery.matches ? "open" : "closed");

  const readSavedState = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const saveState = (state) => {
    try {
      window.localStorage.setItem(storageKey, state);
    } catch {
      return;
    }
  };

  const readScroll = () => {
    try {
      return window.sessionStorage.getItem(scrollKey);
    } catch {
      return null;
    }
  };

  const saveScroll = (value) => {
    try {
      window.sessionStorage.setItem(scrollKey, String(value));
    } catch {
      return;
    }
  };

  const applyState = (state, persist) => {
    const nextState = state === "open" ? "open" : "closed";
    root.dataset.docsNav = nextState;
    button.setAttribute("aria-expanded", String(nextState === "open"));
    button.setAttribute("aria-label", labels[nextState]);
    button.setAttribute("title", labels[nextState]);

    if (persist) {
      saveState(nextState);
    }
  };

  applyState(readSavedState() || getDefaultState(), false);

  button.addEventListener("click", () => {
    const isOpen = root.dataset.docsNav === "open";
    applyState(isOpen ? "closed" : "open", true);
  });

  desktopQuery.addEventListener("change", () => {
    if (!readSavedState()) {
      applyState(getDefaultState(), false);
    }
  });

  if (nav) {
    const savedScroll = Number.parseInt(readScroll() || "", 10);
    const activeLink = nav.querySelector(".is-active");

    if (Number.isFinite(savedScroll)) {
      nav.scrollTop = savedScroll;
    } else if (activeLink) {
      activeLink.scrollIntoView({ block: "nearest" });
    }

    nav.addEventListener(
      "scroll",
      () => {
        saveScroll(nav.scrollTop);
      },
      { passive: true }
    );

    window.addEventListener("pagehide", () => {
      saveScroll(nav.scrollTop);
    });
  }
})();
