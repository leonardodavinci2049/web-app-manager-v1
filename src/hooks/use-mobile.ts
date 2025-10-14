"use client";

import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return isMobile;
}
