import { useState } from "react";
import { Reveal } from "./Reveal";

const items = [
  {
    n: "I",
    title: "Lisbon, Slowly",
    place: "Lisbon · Cascais",
    duration: "1 Day",
    image: "/images/lisbon.jpg",
    desc: "A private morning in Alfama, lunch beside the Tagus, an afternoon at a closed-door atelier of azulejos.",
  },
  {
    n: "II",
    title: "The Sintra Reverie",
    place: "Sintra · Cabo da Roca",
    duration: "1 Day",
    image: "/images/sintra.jpg",
    desc: "Pena before the gates open. A private guide through Quinta da Regaleira's hidden chapels and wells.",
  },
  {
    n: "III",
    title: "Douro by Helicopter",
    place: "Porto · Douro Valley",
    duration: "2 Days",
    image: "/images/douro.jpg",
    desc: "An aerial passage to the valley. Two nights at a 19th-century quinta with private cellar and chef.",
  },
  {
    n: "IV",
    title: "The Algarve Coastline",
    place: "Lagos · Benagil",
    duration: "3 Days",
    image: "/images/algarve.jpg",
    desc: "Sea-cliff villas, private skipper at dawn, a quiet table on the rocks where only the locals dine.",
  },
];

export default function Experiences() {
  const [active, setActive] = useState(0);
  const a = items[active];

  return (
    <section id="experiences" className="relative bg-ink py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <div className="mb-16 flex items-end justify-between gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c9a96a]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/60">
                  02 — Signature Journeys
                </span>
              </div>
              <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.02em] text-bone md:text-7xl">
                Bespoke <span className="italic text-[#d9bc7f]">itineraries.</span>
              </h2>
            </div>
            <p className="hidden max-w-xs font-sans text-sm leading-relaxed text-bone/60 md:block">
              Four signatures. Each entirely re-composable to the cadence of your week.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Image */}
          <Reveal className="lg:col-span-7">
            <div className="media relative aspect-[4/5] w-full overflow-hidden bg-[#15120e] md:aspect-[16/11]">
              {items.map((it, i) => (
                <img
                  key={it.n}
                  src={it.image}
                  alt={it.title}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  style={{ opacity: i === active ? 1 : 0 }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0907]/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/70">
                    {a.place}
                  </div>
                  <div className="mt-1 font-serif text-2xl italic text-bone">
                    {a.title}
                  </div>
                </div>
                <div className="hidden font-sans text-[10px] uppercase tracking-[0.3em] text-[#c9a96a] md:block">
                  {a.duration}
                </div>
              </div>
            </div>
          </Reveal>

          {/* List */}
          <div className="lg:col-span-5">
            <ul>
              {items.map((it, i) => (
                <li key={it.n}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    data-cursor="View"
                    className="group block w-full border-t border-bone/15 py-7 text-left transition-colors last:border-b hover:bg-bone/[0.02]"
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <div className="flex items-baseline gap-6">
                        <span
                          className={`font-serif text-sm italic transition-colors ${
                            i === active ? "text-[#c9a96a]" : "text-bone/40"
                          }`}
                        >
                          {it.n}
                        </span>
                        <span
                          className={`font-serif text-3xl tracking-[-0.01em] transition-colors md:text-4xl ${
                            i === active ? "text-bone" : "text-bone/60 group-hover:text-bone"
                          }`}
                        >
                          {it.title}
                        </span>
                      </div>
                      <span
                        className={`hidden font-sans text-[10px] uppercase tracking-[0.3em] transition-colors md:inline ${
                          i === active ? "text-[#c9a96a]" : "text-bone/40"
                        }`}
                      >
                        {it.duration}
                      </span>
                    </div>
                    <div
                      className="grid transition-[grid-template-rows] duration-700"
                      style={{ gridTemplateRows: i === active ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-bone/65">
                          {it.desc}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.28em] text-[#c9a96a]">
                          Compose this journey
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
