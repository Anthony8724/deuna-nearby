"use client";

import { useEffect, useState } from "react";

/** True after mount — safe point for router.push and Link prefetch. */
export function useClientReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}
