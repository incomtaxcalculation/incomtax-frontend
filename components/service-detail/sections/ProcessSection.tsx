import SectionHeading from "../SectionHeading";
import { resolveIcon } from "../icon-resolver";

export default function ProcessSection({
  processSteps,
  headings,
}: {
  processSteps?: { step: number; title: string; description: string; icon: string }[];
  headings?: { beforeHighlight: string; highlight: string };
}) {
  const steps = processSteps ?? [];
  const h = headings ?? {
    beforeHighlight: "Our Simple Registration",
    highlight: "Process",
  };
  const isStringIcon = steps.length > 0 && typeof steps[0].icon === "string";
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          beforeHighlight={h.beforeHighlight}
          highlight={h.highlight}
          className="mb-12 md:mb-16"
        />

        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          <div
            className="absolute top-6 left-[12%] right-[12%] h-0.5 bg-gray-200"
            aria-hidden
          />
          <div className="grid grid-cols-4 gap-6 relative">
            {steps.map((step) => {
              const Icon = typeof step.icon === "string" ? resolveIcon(step.icon) : step.icon;
              return (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#006666] text-white flex items-center justify-center text-lg font-bold mb-4 shadow-sm">
                    {step.step}
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-[#006666]/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#006666]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#002233] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tablet 2x2 grid */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-8">
          {steps.map((step) => {
            const Icon = typeof step.icon === "string" ? resolveIcon(step.icon) : step.icon;
            return (
              <div key={step.step} className="text-center px-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#006666] text-white flex items-center justify-center text-lg font-bold mb-4">
                  {step.step}
                </div>
                <div className="w-11 h-11 mx-auto rounded-lg bg-[#006666]/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#006666]" />
                </div>
                <h3 className="text-sm font-bold text-[#002233] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden space-y-8 relative pl-8 border-l-2 border-gray-200 ml-4">
          {steps.map((step) => {
            const Icon = typeof step.icon === "string" ? resolveIcon(step.icon) : step.icon;
            return (
              <div key={step.step} className="relative">
                <div className="absolute -left-[calc(2rem+5px)] top-0 w-10 h-10 rounded-full bg-[#006666] text-white flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <div className="flex items-start gap-3 pl-2">
                  <div className="w-10 h-10 rounded-lg bg-[#006666]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#006666]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#002233] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
