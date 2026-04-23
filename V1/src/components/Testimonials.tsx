import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

const quotes = [
  {
    q: "An entirely choreographed week. Not once did we see a clock — yet not once were we late.",
    a: "M. Laurent",
    r: "Private Client · Paris",
  },
  {
    q: "The closest thing to having a Portuguese friend with extraordinary taste and a Maybach.",
    a: "S. Whitford",
    r: "Architect · London",
  },
  {
    q: "We have travelled with the best in Tuscany, Kyoto, the Hamptons. This was, quietly, the best.",
    a: "A. Rosenthal",
    r: "Family Office · NYC",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % quotes.length), 6500);
    return () => clearInterval(id);
  }, []);
  const q = quotes[i];

  return (
    <section id="journal" className="relative overflow-hidden bg-[#0d0b08] py-32 md:py-48">
      <div className="absolute -left-20 top-10 font-serif text-[20rem] leading-none text-[#c9a96a]/[0.06]">
        ”
      </div>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c9a96a]" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/60">
              05 — In Their Words
            </span>
          </div>
        </Reveal>

        <div className="mt-16 min-h-[260px]">
          <Reveal>
            <blockquote
              key={i}
              className="fade-up font-serif text-3xl leading-[1.2] tracking-[-0.01em] text-bone md:text-5xl lg:text-6xl"
            >
              <span className="italic text-[#d9bc7f]">“</span>
              {q.q}
              <span className="italic text-[#d9bc7f]">”</span>
            </blockquote>
          </Reveal>

          <div key={`m-${i}`} className="fade-up mt-10 flex items-center gap-6">
            <div className="h-px w-16 bg-[#c9a96a]" />
            <div>
              <div className="font-serif text-lg italic text-bone">{q.a}</div>
              <div className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                {q.r}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3">
          {quotes.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              data-cursor="View"
              className={`h-px transition-all duration-500 ${
                k === i ? "w-16 bg-[#c9a96a]" : "w-8 bg-bone/30 hover:bg-bone/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
