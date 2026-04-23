import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    const tick = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Lisbon",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(d));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(id);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled ? "bg-[#0a0907]/80 backdrop-blur-xl py-4" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
        <a href="#top" className="flex items-center gap-3" data-cursor="Home">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#c9a96a" strokeWidth="0.6" />
            <path d="M9 18 L14 8 L19 18 M11 14 H17" stroke="#ece6dc" strokeWidth="0.8" fill="none" />
          </svg>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-[15px] italic tracking-wide text-bone">Executive</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.35em] text-bone/60">Tour Service</span>
          </div>
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {[
            ["Experiences", "#experiences"],
            ["Fleet", "#fleet"],
            ["Destinations", "#destinations"],
            ["Journal", "#journal"],
            ["Concierge", "#contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="link-u font-sans text-[12px] uppercase tracking-[0.25em] text-bone/80 hover:text-bone"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden flex-col items-end leading-none md:flex">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">Lisbon</span>
            <span className="font-serif text-sm tabular-nums text-bone">{time}</span>
          </div>
          <a
            href="#contact"
            data-cursor="Reserve"
            className="btn-gold group inline-flex items-center gap-2 border border-[#c9a96a]/50 px-5 py-3 font-sans text-[11px] uppercase tracking-[0.25em] text-bone transition-colors hover:border-[#c9a96a] hover:bg-[#c9a96a] hover:text-[#0a0907]"
          >
            Reserve
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
