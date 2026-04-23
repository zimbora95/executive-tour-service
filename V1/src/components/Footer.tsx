export default function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-[#070605] pb-10 pt-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex flex-col gap-12">
          <div className="font-serif text-[18vw] leading-[0.85] tracking-[-0.04em] text-bone md:text-[12vw]">
            Executive<span className="italic text-[#d9bc7f]">.</span>
          </div>

          <div className="grid grid-cols-2 gap-10 border-t border-bone/10 pt-10 md:grid-cols-4">
            <div>
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                Navigate
              </div>
              <ul className="mt-5 space-y-3 font-serif text-lg text-bone">
                {["Experiences", "Fleet", "Destinations", "Concierge"].map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} className="link-u">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                Follow
              </div>
              <ul className="mt-5 space-y-3 font-serif text-lg text-bone">
                {["Instagram", "Are.na", "Vimeo", "LinkedIn"].map((l) => (
                  <li key={l}>
                    <a href="#" className="link-u">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                Recognised
              </div>
              <ul className="mt-5 space-y-3 font-serif text-base text-bone/80">
                <li>Condé Nast Traveller — Top 25</li>
                <li>Robb Report Best of the Best</li>
                <li>Virtuoso Preferred Partner</li>
              </ul>
            </div>
            <div>
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                Newsletter
              </div>
              <p className="mt-5 font-serif text-base text-bone/80">
                Six dispatches a year. Never an offer.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 flex border-b border-bone/30"
              >
                <input
                  type="email"
                  placeholder="your@email"
                  className="flex-1 bg-transparent py-2 font-serif text-base text-bone outline-none placeholder:text-bone/30"
                />
                <button data-cursor="Subscribe" className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#c9a96a]">
                  →
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-8 font-sans text-[10px] uppercase tracking-[0.28em] text-bone/40 md:flex-row md:items-center">
            <div>© {new Date().getFullYear()} Executive Tour Service · Lisboa, Portugal</div>
            <div className="flex gap-6">
              <a href="#" className="link-u">Privacy</a>
              <a href="#" className="link-u">Terms</a>
              <a href="#" className="link-u">RNAVT 4827</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
