"use client";

export function HypothesisSection() {
  return (
    <section className="relative max-w-4xl mx-auto py-20 px-6 text-center" aria-labelledby="hypothesis-title">
      <div className="p-8 sm:p-12 rounded-3xl border border-[#DFDFD8] bg-[#FAF9F5] backdrop-blur-md shadow-xs">
        <p className="eyebrow">Our Hypothesis</p>
        <h2 id="hypothesis-title" className="text-2xl sm:text-4xl font-bold text-[#263746] tracking-tight leading-tight max-w-2xl mx-auto">
          A voice assistant can create a more natural conversational experience for emotionally sensitive conversations when the user controls when they are ready for a response.
        </h2>

        <div className="mt-8 pt-8 border-t border-[#DFDFD8] max-w-xl mx-auto space-y-2">
          <p className="text-sm font-extrabold uppercase tracking-widest text-[#70746E]">Responsible Product Boundaries</p>
          <p className="text-lg sm:text-xl font-bold text-[#557C72]">
            We are not building a therapist.
          </p>
          <p className="text-base text-[#263746]/80 font-medium">
            We are building a better way to talk to an AI.
          </p>
        </div>
      </div>
    </section>
  );
}
