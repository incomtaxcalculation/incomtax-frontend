import { Zap } from "lucide-react";
import { resolveIcon } from "../icon-resolver";

export default function DocumentsTimelineSection({
  documentRequirements,
  timelineMetrics,
  fastProcessingText,
  requiredDocsTitle,
  timeRequiredTitle,
}: {
  documentRequirements?: { applicantType: string; icon: string; documents: string[] }[];
  timelineMetrics?: { label: string; value: string; icon: string }[];
  fastProcessingText?: string;
  requiredDocsTitle?: string;
  timeRequiredTitle?: string;
}) {
  const docReqs = documentRequirements ?? [];
  const metrics = timelineMetrics ?? [];
  const fastText = fastProcessingText ?? "";
  const docsTitle = requiredDocsTitle ?? "Required Documents";
  const timeTitle = timeRequiredTitle ?? "Time Required";
  const isStringIcon = docReqs.length > 0 && typeof docReqs[0].icon === "string";
  return (
    <section className="py-14 md:py-20 bg-[#F4F7F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-3">
            <h2 className="text-xl md:text-2xl font-bold text-[#002233] mb-6">
              {docsTitle}
            </h2>
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="bg-[#002233] text-white">
                    <th className="px-4 py-3.5 md:px-5 font-semibold w-[38%]">
                      Applicant Type
                    </th>
                    <th className="px-4 py-3.5 md:px-5 font-semibold">
                      Required Documents
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docReqs.map((row, index) => {
                    const Icon = typeof row.icon === "string" ? resolveIcon(row.icon) : row.icon;
                    return (
                      <tr
                        key={row.applicantType}
                        className={
                          index < docReqs.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }
                      >
                        <td className="px-4 py-4 md:px-5 align-top">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#006666]/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4 text-[#006666]" />
                            </div>
                            <span className="font-semibold text-[#002233] text-sm">
                              {row.applicantType}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 md:px-5 align-top text-gray-600">
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {row.documents.map((doc) => (
                              <li key={doc}>{doc}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {docReqs.map((row) => {
                const Icon = typeof row.icon === "string" ? resolveIcon(row.icon) : row.icon;
                return (
                  <div key={row.applicantType} className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#006666]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#006666]" />
                      </div>
                      <span className="font-semibold text-[#002233] text-sm">
                        {row.applicantType}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5">Required Documents</p>
                      <ul className="space-y-1">
                        {row.documents.map((doc) => (
                          <li key={doc} className="flex items-start gap-2 text-sm">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#006666] shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-[#002233] mb-6">
              {timeTitle}
            </h2>
            <div className="space-y-5 flex-1">
              {metrics.map((metric) => {
                const Icon = typeof metric.icon === "string" ? resolveIcon(metric.icon) : metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="flex items-start gap-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#006666]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#006666]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                      <p className="text-base font-bold text-[#002233] mt-0.5">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-[#006666] p-5 md:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <p className="text-sm md:text-[15px] text-white leading-relaxed font-medium">
                {fastText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
