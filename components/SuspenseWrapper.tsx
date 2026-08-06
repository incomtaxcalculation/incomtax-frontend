"use client";

import { Suspense as ReactSuspense } from "react";

export function SuspenseWrapper({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <ReactSuspense fallback={fallback || <div>Loading...</div>}>{children}</ReactSuspense>;
}