import { Reveal } from "./Reveal";

export default function Manifesto() {
  return (
    <section className="relative bg-ink py-32 md:py-48">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:px-12">
        <div className="md:col-span-3">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a96a]" />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/60">
                01 — Manifesto
              </span>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-9">
          <Reveal delay={120}>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-bone md:text-6xl lg:text-7xl">
              We do not arrange tours.{" "}
              <span className="italic text-[#d9bc7f]">We compose silences,</span>{" "}
              tablescapes and unhurried hours — across the most beautiful country
              you may not yet know by heart.
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                k: "Discretion",
                v: "Our chauffeurs speak four languages and ten silences. Every detail is rehearsed; nothing is performed.",
              },
              {
                k: "Curation",
                v: "From a private cellar in the Douro to a closed-door pastelaria in Alfama — we open doors that are rarely seen.",
              },
              {
                k: "Time",
                v: "We design days that breathe. No queues, no hurry — only the precise rhythm of a country lived slowly.",
              },
            ].map((c, i) => (
              <Reveal key={c.k} delay={200 + i * 120}>
                <div className="border-t border-bone/15 pt-6">
                  <div className="font-serif text-2xl italic text-[#c9a96a]">
                    {c.k}
                  </div>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-bone/70">
                    {c.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
