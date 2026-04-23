import { useState } from "react";
import { Reveal } from "./Reveal";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative bg-ink py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c9a96a]" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/60">
                  06 — The Concierge
                </span>
              </div>
              <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.02em] text-bone md:text-7xl lg:text-8xl">
                Begin <span className="italic text-[#d9bc7f]">the conversation.</span>
              </h2>
              <p className="mt-8 max-w-md font-serif text-lg text-bone/75">
                We respond personally within twelve hours. Tell us a little about the days
                you have in mind — we will compose the rest.
              </p>

              <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                    Concierge
                  </dt>
                  <dd className="mt-2 font-serif text-xl text-bone">
                    concierge@executivetour.pt
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                    Direct
                  </dt>
                  <dd className="mt-2 font-serif text-xl text-bone">
                    +351 910 000 000
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                    Atelier
                  </dt>
                  <dd className="mt-2 font-serif text-xl text-bone">
                    Av. da Liberdade 144<br />1250-146 Lisboa
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                    Hours
                  </dt>
                  <dd className="mt-2 font-serif text-xl text-bone">
                    By appointment<br />24/7 for guests
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:col-span-6 lg:col-start-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-10 border border-bone/15 bg-[#0d0b08] p-8 md:p-12"
            >
              {sent ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="font-serif text-5xl italic text-[#d9bc7f]">Thank you.</div>
                  <p className="mt-4 max-w-sm font-serif text-lg text-bone/70">
                    Your inquiry is in our atelier. A concierge will respond within twelve hours.
                  </p>
                </div>
              ) : (
                <>
                  {[
                    { l: "Your name", t: "text", n: "name" },
                    { l: "Email", t: "email", n: "email" },
                    { l: "Travel dates", t: "text", n: "dates" },
                  ].map((f) => (
                    <label key={f.n} className="block">
                      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                        {f.l}
                      </span>
                      <input
                        type={f.t}
                        name={f.n}
                        required
                        className="mt-3 w-full border-b border-bone/20 bg-transparent pb-3 font-serif text-xl text-bone outline-none transition-colors focus:border-[#c9a96a]"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-bone/50">
                      Tell us about the journey
                    </span>
                    <textarea
                      name="message"
                      rows={3}
                      className="mt-3 w-full resize-none border-b border-bone/20 bg-transparent pb-3 font-serif text-lg text-bone outline-none transition-colors focus:border-[#c9a96a]"
                    />
                  </label>
                  <button
                    type="submit"
                    data-cursor="Send"
                    className="btn-gold group inline-flex w-full items-center justify-between gap-3 bg-[#c9a96a] px-8 py-5 font-sans text-[11px] uppercase tracking-[0.3em] text-[#0a0907] transition-transform hover:-translate-y-0.5"
                  >
                    Send to the Concierge
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
