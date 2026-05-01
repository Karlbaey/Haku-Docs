(() => {
  const copyButtons = document.querySelectorAll("[data-code-copy]");

  if (copyButtons.length === 0) {
    return;
  }

  const resetLabel = (button) => {
    const label = button.querySelector("[data-code-copy-label]");
    if (label) {
      label.textContent = "复制";
    }

    button.dataset.copyState = "idle";
  };

  const setState = (button, state, text) => {
    const label = button.querySelector("[data-code-copy-label]");
    if (label) {
      label.textContent = text;
    }

    button.dataset.copyState = state;
  };

  const writeToClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("copy failed");
    }
  };

  copyButtons.forEach((button) => {
    let resetTimer = null;

    button.addEventListener("click", async () => {
      const frame = button.closest(".code-frame");
      const code = frame?.querySelector("pre code, pre");

      if (!code) {
        setState(button, "error", "失败");
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => resetLabel(button), 1600);
        return;
      }

      try {
        await writeToClipboard(code.textContent ?? "");
        setState(button, "success", "已复制");
      } catch {
        setState(button, "error", "失败");
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => resetLabel(button), 1600);
    });
  });
})();
