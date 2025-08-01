// utils/isHardReload.ts
export const isHardReload = () => {
  if (typeof window === "undefined") return false;

  // Navigation type 1 = reload (F5)
  const navigationEntry = performance?.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigationEntry?.type === "reload") {
    return true;
  }

  return false;
};
