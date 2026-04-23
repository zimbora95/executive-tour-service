import { Reveal } from "./Reveal";

const cars = [
  { name: "Mercedes-Maybach S-Class", cat: "Sedan", seats: "1–3 Guests", year: "2025" },
  { name: "Mercedes V-Class Exclusive", cat: "Van", seats: "1–6 Guests", year: "2025" },
  { name: "Range Rover Autobiography", cat: "SUV", seats: "1–4 Guests", year: "2024" },
  { name: "Mercedes Sprinter VIP", cat: "Lounge Bus", seats: "1–14 Guests", year: "2024" },
];

export default function Fleet() {
  return (
    <section id="fleet" className="relative overflow-hidden bg-[#0d0b08] py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c9a96a]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/60">
                  03 — The Fleet
                </span>
              </div>
              <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.02em] text-bone md:text-7xl">
                Quiet<br />
                <span className="italic text-[#d9bc7f]">machines.</span>
              </h2>
              <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-bone/70">
                Each vehicle is a private salon — temperature-tuned, scent-curated, with a
                playlist composed for your route. Every chauffeur, a sommelier of the road.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-12 media aspect-[4/5] w-full max-w-md">
                <img src="/images/fleet.jpg" alt="Luxury car interior" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ul>
              {cars.map((c, i) => (
                <Reveal key={c.name} delay={i * 100}>
                  <li className="group grid grid-cols-12 gap-4 border-t border-bone/15 py-8 last:border-b">
                    <span className="col-span-1 font-serif text-sm italic text-[#c9a96a]/70">
                      0{i + 1}
                    </span>
                    <div className="col-span-7 md:col-span-6">
                      <div className="font-serif text-2xl tracking-[-0.01em] text-bone md:text-3xl">
                        {c.name}
                      </div>
                      <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.28em] text-bone/50">
                        {c.cat}
                      </div>
                    </div>
                    <div className="col-span-3 self-center font-sans text-[11px] uppercase tracking-[0.25em] text-bone/60 md:col-span-3">
                      {c.seats}
                    </div>
                    <div className="col-span-1 self-center text-right font-sans text-[11px] uppercase tracking-[0.25em] text-bone/40 md:col-span-2">
                      {c.year}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={500}>
              <div className="mt-16 grid grid-cols-2 gap-8 border-t border-bone/15 pt-10 md:grid-cols-4">
                {[
                  ["16", "Years"],
                  ["42", "Chauffeurs"],
                  ["1.2k", "Guests / yr"],
                  ["98%", "Returning"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-serif text-5xl text-[#d9bc7f] md:text-6xl">{n}</div>
                    <div className="mt-2 font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
