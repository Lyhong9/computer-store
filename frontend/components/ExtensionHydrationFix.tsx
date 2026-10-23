"use client";

if (typeof window !== "undefined") {
  const isExtensionError = (
    filename?: string | null,
    message?: string | null,
    stack?: string | null
  ) => {
    const fn = (filename || "").toLowerCase();
    const msg = (message || "").toLowerCase();
    const stk = (stack || "").toLowerCase();

    return (
      fn.includes("chrome-extension://") ||
      fn.includes("moz-extension://") ||
      fn.includes("safari-extension://") ||
      stk.includes("chrome-extension://") ||
      stk.includes("moz-extension://") ||
      stk.includes("safari-extension://") ||
      stk.includes("eppiocemhmnlbhjplcgkofciiegomcon") ||
      msg.includes("m_id") ||
      msg.includes("bis_skin_checked") ||
      msg.includes("bis_register")
    );
  };

  // 1. Intercept window error events in capture phase before Next.js dev overlay catches them
  window.addEventListener(
    "error",
    (event) => {
      if (
        isExtensionError(
          event.filename,
          event.message,
          event.error?.stack || event.error?.message
        )
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  // 2. Intercept unhandled promise rejections from extensions in capture phase
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      const reason = event.reason;
      const stack = typeof reason === "object" ? reason?.stack : "";
      const message = typeof reason === "object" ? reason?.message : String(reason);

      if (isExtensionError(undefined, message, stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  // 3. Fallback window.onerror handler
  const prevOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (
      isExtensionError(
        typeof source === "string" ? source : undefined,
        typeof message === "string" ? message : undefined,
        error?.stack
      )
    ) {
      return true; // suppresses the error from popping up in dev overlay
    }
    if (prevOnError) {
      return prevOnError.apply(this, arguments as any);
    }
    return false;
  };

  // 4. Suppress extension console error logs
  const origError = console.error;
  console.error = function (...args: any[]) {
    const fullMessage = args
      .map((a) => (typeof a === "string" ? a : a?.message || a?.stack || ""))
      .join(" ");

    if (
      isExtensionError(undefined, fullMessage, fullMessage)
    ) {
      return;
    }
    return origError.apply(this, args);
  };

  // 5. Strip extension attributes that cause hydration mismatches (Bitdefender, etc.)
  const stripAttributes = () => {
    try {
      const elements = document.querySelectorAll(
        "[bis_skin_checked], [bis_register]"
      );
      elements.forEach((el) => {
        el.removeAttribute("bis_skin_checked");
        el.removeAttribute("bis_register");
      });
    } catch {}
  };

  stripAttributes();

  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver((mutations) => {
      let needsCleanup = false;
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (
          m.type === "attributes" &&
          (m.attributeName === "bis_skin_checked" ||
            m.attributeName === "bis_register")
        ) {
          needsCleanup = true;
          break;
        }
      }
      if (needsCleanup) {
        stripAttributes();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["bis_skin_checked", "bis_register"],
    });
  }
}

export function ExtensionHydrationFix() {
  return null;
}
