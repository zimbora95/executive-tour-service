import { Reveal } from "./Reveal";

const dests = [
  {
    name: "Sintra",
    coords: "38.80°N · 9.39°W",
    image: "/images/sintra.jpg",
    blurb: "Forests of granite, palaces of dream.",
  },
  {
    name: "Douro",
    coords: "41.10°N · 7.78°W",
    image: "/images/douro.jpg",
    blurb: "A river that taught a country to wait.",
  },
  {
    name: "Lisbon",
    coords: "38.72°N · 9.13°W",
    image: "/images/lisbon.jpg",
    blurb: "Seven hills, a thousand small windows.",
  },
  {
    name: "Algarve",
    coords: "37.09°N · 8.24°W",
    image: "/images/algarve.jpg",
    blurb: "Light cut from limestone and salt.",
  },
];

export default function Destinations() {
  return (
    <section id="destinations" className="bg-ink py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <div className="mb-20 flex items-end justify-between gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c9a96a]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/60">
                  04 — Destinations
                </span>
              </div>
              <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.02em] text-bone md:text-7xl">
                A country worth <span className="italic text-[#d9bc7f]">slowing for.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2 lg:gap-x-16">
          {dests.map((d, i) => (
            <Reveal key={d.name} delay={(i % 2) * 150}>
              <a href="#contact" data-cursor="Explore" className="group block">
                <div className={`media relative aspect-[4/5] overflow-hidden ${i % 2 === 1 ? "md:translate-y-24" : ""}`}>
                  <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0907]/40 to-transparent" />
                  <div className="absolute left-5 top-5 font-sans text-[10px] uppercase tracking-[0.3em] text-bone/70">
                    {d.coords}
                  </div>
                  <div className="absolute bottom-5 right-5 font-sans text-[10px] uppercase tracking-[0.3em] text-[#c9a96a] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Explore →
                  </div>
                </div>
                <div className={`mt-6 flex items-baseline justify-between ${i % 2 === 1 ? "md:translate-y-24" : ""}`}>
                  <h3 className="font-serif text-4xl italic text-bone md:text-5xl">
                    {d.name}
                  </h3>
                  <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-bone/50">
                    0{i + 1} / 04
                  </span>
                </div>
                <p
                  className={`mt-2 font-serif text-lg text-bone/70 ${
                    i % 2 === 1 ? "md:translate-y-24" : ""
                  }`}
                >
                  {d.blurb}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
