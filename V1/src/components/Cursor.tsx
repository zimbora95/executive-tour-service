import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-cursor]");
      if (interactive) {
        setHover(true);
        setLabel(interactive.getAttribute("data-cursor"));
      } else {
        setHover(false);
        setLabel(null);
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-[#c9a96a] md:block"
      />
      <div
        ref={ring}
        className={`pointer-events-none fixed left-0 top-0 z-[99] hidden items-center justify-center rounded-full border border-[#c9a96a]/60 backdrop-blur-[2px] transition-[width,height,background-color] duration-300 md:flex ${
          hover ? "h-20 w-20 bg-[#c9a96a]/15" : "h-9 w-9 bg-transparent"
        }`}
      >
        {label && (
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-bone">{label}</span>
        )}
      </div>
    </>
  );
}
