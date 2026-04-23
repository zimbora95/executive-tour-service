export default function Marquee() {
  const items = [
    "Lisbon",
    "Sintra",
    "Cascais",
    "Évora",
    "Douro Valley",
    "Porto",
    "Comporta",
    "Algarve",
    "Óbidos",
    "Alentejo",
  ];
  return (
    <section className="border-y border-bone/10 bg-ink py-10 overflow-hidden">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
        {[...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-16 font-serif text-5xl italic text-bone/80 md:text-7xl"
          >
            {it}
            <span className="text-[#c9a96a]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
