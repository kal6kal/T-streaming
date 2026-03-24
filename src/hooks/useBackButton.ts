// src/hooks/useBackButton.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * On homepage ("/"), intercept browser Back and attempt app exit.
 * If close is blocked by browser policy, fall back to a blank page.
 */
export function useBackButton() {
  const location = useLocation();

  useEffect(() => {
    const isHome = location.pathname === "/";
    if (!isHome) return;

    const pushSentinel = () => {
      window.history.pushState({ __home_sentinel: true }, "");
    };

    pushSentinel();

    const handlePopState = () => {
      // Attempt to close tab/window.
      window.close();

      // Fallback when close is blocked by browser.
      window.location.href = "about:blank";
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname]);
}
