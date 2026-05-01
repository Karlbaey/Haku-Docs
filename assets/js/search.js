(() => {
  const dialog = document.querySelector("[data-search-dialog]");
  const openButtons = document.querySelectorAll("[data-search-open]");
  const closeButton = dialog?.querySelector("[data-search-close]");
  const input = dialog?.querySelector("[data-search-input]");
  const results = dialog?.querySelector("[data-search-results]");
  const status = dialog?.querySelector("[data-search-status]");
  const scriptPath = dialog?.dataset.searchScriptPath;
  const bundlePath = dialog?.dataset.searchBundlePath;
  const baseUrl = dialog?.dataset.searchBaseUrl || "/";

  if (!dialog || !input || !results || !status || !scriptPath || openButtons.length === 0) {
    return;
  }

  let pagefind = null;
  let pagefindReady = null;
  let activeTrigger = null;
  let searchToken = 0;

  const statusMessages = {
    idle: "",
    loading: "正在准备搜索索引……",
    empty: "没有找到匹配结果。",
    error: "搜索暂时不可用，请稍后重试。",
  };

  const setStatus = (message) => {
    status.textContent = message;
  };

  const escapeHTML = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const normalizeURL = (url) => {
    try {
      return new URL(url, window.location.origin).pathname;
    } catch {
      return url;
    }
  };

  const loadPagefind = async () => {
    if (!pagefindReady) {
      setStatus(statusMessages.loading);
      pagefindReady = import(scriptPath)
        .then(async (module) => {
          pagefind = module;
          await pagefind.options({
            excerptLength: 20,
            highlightParam: "highlight",
            baseUrl,
            bundlePath,
          });
          await pagefind.init();

          if (!input.value.trim()) {
            setStatus(statusMessages.idle);
          }

          return pagefind;
        })
        .catch((error) => {
          pagefindReady = null;
          throw error;
        });
    }

    return pagefindReady;
  };

  const closeDialog = () => {
    if (!dialog.open) {
      return;
    }

    dialog.close();
    results.innerHTML = "";
    input.value = "";
    setStatus(statusMessages.idle);

    if (activeTrigger instanceof HTMLElement) {
      activeTrigger.focus();
    }
  };

  const openDialog = async (trigger) => {
    activeTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;

    if (!dialog.open) {
      dialog.showModal();
    }

    input.focus();

    try {
      await loadPagefind();
    } catch {
      setStatus(statusMessages.error);
    }
  };

  const renderResults = async (matches, token) => {
    const items = await Promise.all(
      matches.slice(0, 8).map(async (match) => {
        const data = await match.data();
        return {
          url: normalizeURL(data.url),
          title: data.meta.title || "未命名页面",
          section: data.meta.section || "",
          excerpt: data.excerpt || "",
        };
      })
    );

    if (token !== searchToken) {
      return;
    }

    if (items.length === 0) {
      results.innerHTML = "";
      setStatus(statusMessages.empty);
      return;
    }

    results.innerHTML = items
      .map(
        (item) => `
          <a class="search-result" href="${item.url}">
            <span class="search-result__section">${escapeHTML(item.section || "文档")}</span>
            <strong class="search-result__title">${escapeHTML(item.title)}</strong>
            <span class="search-result__excerpt">${item.excerpt}</span>
          </a>
        `
      )
      .join("");

    setStatus(`找到 ${items.length} 条结果。`);
  };

  const runSearch = async (query) => {
    const trimmed = query.trim();
    searchToken += 1;
    const token = searchToken;

    if (!trimmed) {
      results.innerHTML = "";
      setStatus(statusMessages.idle);
      return;
    }

    setStatus(`正在搜索 “${trimmed}”…`);

    try {
      const api = await loadPagefind();
      const response = await api.search(trimmed);

      if (!response || !response.results) {
        results.innerHTML = "";
        setStatus(statusMessages.empty);
        return;
      }

      await renderResults(response.results, token);
    } catch {
      if (token !== searchToken) {
        return;
      }

      results.innerHTML = "";
      setStatus(statusMessages.error);
    }
  };

  let searchTimer = null;
  input.addEventListener("input", (event) => {
    const query = event.target.value;

    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      void runSearch(query);
    }, 120);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  closeButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("close", () => {
    results.innerHTML = "";
    input.value = "";
    setStatus(statusMessages.idle);
  });

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      void openDialog(button);
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      void openDialog(document.activeElement);
    }

    if (event.key === "Escape" && dialog.open) {
      event.preventDefault();
      closeDialog();
    }
  });

  results.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      closeDialog();
    }
  });
})();
