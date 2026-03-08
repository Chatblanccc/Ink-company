"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Back to top"
      className={`fixed bottom-[28px] right-[28px] z-50 flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#000] text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-[#333] hover:scale-110 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-[12px] pointer-events-none"
      }`}
    >
      <ArrowUp className="size-[18px]" strokeWidth={2.5} />
    </button>
  );
}
