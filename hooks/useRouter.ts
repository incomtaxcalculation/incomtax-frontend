"use client";

import { useCallback, useMemo } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
  easing: "ease",
  speed: 500,
});

export function useRouter() {
  const router = useNextRouter();

  const push = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      NProgress.start();
      router.push(href, options);
    },
    [router],
  );

  const replace = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      NProgress.start();
      router.replace(href, options);
    },
    [router],
  );

  const back = useCallback(() => {
    NProgress.start();
    router.back();
  }, [router]);

  const forward = useCallback(() => {
    NProgress.start();
    router.forward();
  }, [router]);

  const refresh = useCallback(() => {
    NProgress.start();
    router.refresh();
  }, [router]);

  return useMemo(
    () => ({
      ...router,
      push,
      replace,
      back,
      forward,
      refresh,
    }),
    [router, push, replace, back, forward, refresh],
  );
}
