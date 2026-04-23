import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[760px] w-full overflow-hidden bg-ink">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${y * 0.35}px, 0) scale(${1 + y * 0.0004})` }}
      >
        <img
          src="/images/hero.jpg"
          alt="Maybach at Lisbon palace at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0907]/50 via-[#0a0907]/30 to-[#0a0907]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0907]/70 via-transparent to-transparent" />
      </div>

      {/* Top eyebrow */}
      <div className="absolute inset-x-0 top-28 z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-center gap-3 fade-up" style={{ animationDelay: "0.2s" }}>
          <span className="h-px w-10 bg-[#c9a96a]" />
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-bone/70">
            Est. 2009 — Portugal
          </span>
        </div>
      </div>

      {/* Main title */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-6 pb-16 md:px-12 md:pb-24">
        <h1 className="font-serif text-[15vw] leading-[0.85] tracking-[-0.04em] text-bone md:text-[11vw]">
          <span className="block overflow-hidden">
            <span className="rise inline-block" style={{ animationDelay: "0.1s" }}>
              <span>The Art of</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="rise inline-block italic text-[#d9bc7f]" style={{ animationDelay: "0.25s" }}>
              <span>Arrival.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <p
            className="fade-up max-w-md font-serif text-lg leading-relaxed text-bone/80 md:col-span-5 md:col-start-2 md:text-xl"
            style={{ animationDelay: "0.6s" }}
          >
            Private chauffeurs, bespoke itineraries, and quiet luxury — composed for those
            who measure travel in moments, not miles.
          </p>

          <div
            className="fade-up flex flex-wrap items-center gap-6 md:col-span-5 md:col-start-8 md:justify-end"
            style={{ animationDelay: "0.8s" }}
          >
            <a
              href="#experiences"
              data-cursor="Discover"
              className="btn-gold group inline-flex items-center gap-3 bg-[#c9a96a] px-8 py-4 font-sans text-[11px] uppercase tracking-[0.28em] text-[#0a0907] transition-transform hover:-translate-y-0.5"
            >
              Discover Journeys
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              data-cursor="Watch"
              className="group inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.28em] text-bone"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-bone/40 transition-colors group-hover:border-[#c9a96a] group-hover:bg-[#c9a96a]/10">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0 0 L10 6 L0 12 Z" />
                </svg>
              </span>
              The Film
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-bone/50">Scroll</span>
          <span className="block h-10 w-px overflow-hidden bg-bone/20">
            <span className="block h-1/2 w-full animate-pulse bg-[#c9a96a]" />
          </span>
        </div>
      </div>
    </section>
  );
}
