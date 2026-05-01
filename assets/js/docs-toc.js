(() => {
  const root = document.querySelector("[data-docs-toc]");
  if (!root) {
    return;
  }

  const links = Array.from(root.querySelectorAll("a"));
  if (links.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = links
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) {
        return null;
      }

      const target = document.querySelector(id);
      if (!target) {
        return null;
      }

      return { link, target };
    })
    .filter(Boolean);

  const activate = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive && !prefersReducedMotion) {
        link.scrollIntoView({ block: "nearest" });
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        activate(visible.target.id);
      }
    },
    {
      rootMargin: "-15% 0px -70% 0px",
      threshold: [0.1, 0.6, 1],
    }
  );

  targets.forEach(({ target }) => observer.observe(target));
})();
