"use client";

import { useEffect } from "react";

const ROOT_CLASS = "pitch-active";

export function PitchScrollEnabler() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(ROOT_CLASS);
    return () => {
      root.classList.remove(ROOT_CLASS);
    };
  }, []);
  return null;
}
