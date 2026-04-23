import { useEffect, useState } from "react";

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 8 + 4;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setPct(100);
        setTimeout(() => setDone(true), 600);
      } else {
        setPct(Math.floor(v));
      }
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0907] transition-all duration-1000 ${
        done ? "pointer-events-none -translate-y-full" : ""
      }`}
    >
      <div className="font-serif text-2xl italic text-bone">Executive</div>
      <div className="mt-2 font-sans text-[10px] uppercase tracking-[0.4em] text-bone/40">
        Tour Service · Portugal
      </div>
      <div className="mt-12 h-px w-64 bg-bone/15">
        <div
          className="h-full bg-[#c9a96a] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-4 font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50 tabular-nums">
        {String(pct).padStart(3, "0")}
      </div>
    </div>
  );
}
