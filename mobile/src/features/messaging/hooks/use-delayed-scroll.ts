import { useCallback, useEffect, useRef } from "react";

export function useDelayedScroll(scroll: () => void, delay = 100) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return useCallback(() => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(scroll, delay);
  }, [delay, scroll]);
}
