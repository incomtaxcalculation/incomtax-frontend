import SectionHeading from "../SectionHeading";
import { resolveIcon } from "../icon-resolver";

export default function ServicesIncludeSection({
  includedServices,
  headings,
}: {
  includedServices?: { title: string; description: string; icon: string }[];
  headings?: { beforeHighlight: string; highlight: string; afterHighlight: string };
}) {
  const services = includedServices ?? [];
  const h = headings ?? {
    beforeHighlight: "Our Income Tax Registration",
    highlight: "Services",
    afterHighlight: " Include",
  };
  const iconProp = "icon" in (services[0] ?? {}) && typeof services[0]?.icon === "string";
  return (
    <section className="py-14 md:py-20 bg-[#F4F7F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          beforeHighlight={h.beforeHighlight}
          highlight={h.highlight}
          afterHighlight={h.afterHighlight}
          className="mb-10 md:mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((service) => {
            const Icon = typeof service.icon === "string" ? resolveIcon(service.icon) : service.icon;
            return (
              <div
                key={service.title}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-7 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#006666]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#006666]" />
                </div>
                <h3 className="text-base font-bold text-[#002233] mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
