import { FileWarning, ShieldCheck, X, Check } from "lucide-react";
import SectionHeading from "../SectionHeading";
import type { TextItem } from "../types";

export default function StruggleSection({
  solutionIntro,
  commonProblems,
  solutions,
  headings,
}: {
  solutionIntro?: string;
  commonProblems?: TextItem[];
  solutions?: TextItem[];
  headings?: { beforeHighlight: string; highlight: string };
}) {
  const intro = solutionIntro ?? "";
  const problems = commonProblems ?? [];
  const sols = solutions ?? [];
  const h = headings ?? {
    beforeHighlight: "Why People Struggle With",
    highlight: "Registration",
  };
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          beforeHighlight={h.beforeHighlight}
          highlight={h.highlight}
          className="mb-10 md:mb-12"
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-2xl bg-[#FEF2F2] border border-red-100/80 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <FileWarning className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-[#002233]">
                Common Problems
              </h3>
            </div>
            <ul className="space-y-3.5">
              {problems.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                    <X className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="text-sm md:text-[15px] text-gray-700 leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[#E8F5F4] border border-teal-100/80 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#006666]/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#006666]" />
              </div>
              <h3 className="text-lg font-bold text-[#002233]">Our Solution</h3>
            </div>
            <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed mb-5">
              {intro}
            </p>
            <ul className="space-y-3.5">
              {sols.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006666] text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="text-sm md:text-[15px] text-gray-700 leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
