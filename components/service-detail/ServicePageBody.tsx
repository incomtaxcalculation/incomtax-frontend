import type { TemplateData } from "./types";
import StruggleSection from "./sections/StruggleSection";
import ServicesIncludeSection from "./sections/ServicesIncludeSection";
import ProcessSection from "./sections/ProcessSection";
import DocumentsTimelineSection from "./sections/DocumentsTimelineSection";
import WhyChooseSection from "./sections/WhyChooseSection";
import TestimonialsSection from "./sections/TestimonialsSection";

export default function ServicePageBody({
  templateData,
}: {
  templateData: TemplateData;
}) {
  return (
    <>
      <StruggleSection
        solutionIntro={templateData.solutionIntro}
        commonProblems={templateData.commonProblems}
        solutions={templateData.solutions}
        headings={{
          beforeHighlight: templateData.sectionHeadings.struggle.beforeHighlight,
          highlight: templateData.sectionHeadings.struggle.highlight,
        }}
      />
      <ServicesIncludeSection
        includedServices={templateData.includedServices}
        headings={{
          beforeHighlight: templateData.sectionHeadings.servicesInclude.beforeHighlight,
          highlight: templateData.sectionHeadings.servicesInclude.highlight,
          afterHighlight: templateData.sectionHeadings.servicesInclude.afterHighlight,
        }}
      />
      <ProcessSection
        processSteps={templateData.processSteps}
        headings={{
          beforeHighlight: templateData.sectionHeadings.process.beforeHighlight,
          highlight: templateData.sectionHeadings.process.highlight,
        }}
      />
      <DocumentsTimelineSection
        documentRequirements={templateData.documentRequirements}
        timelineMetrics={templateData.timelineMetrics}
        fastProcessingText={templateData.fastProcessingText}
        requiredDocsTitle={templateData.sectionHeadings.documentsTimeline.requiredDocs}
        timeRequiredTitle={templateData.sectionHeadings.documentsTimeline.timeRequired}
      />
      <WhyChooseSection
        whyChooseFeatures={templateData.whyChooseFeatures}
        headings={{
          beforeHighlight: templateData.sectionHeadings.whyChoose.beforeHighlight,
          highlight: templateData.sectionHeadings.whyChoose.highlight,
        }}
      />
      <TestimonialsSection
        serviceTestimonials={templateData.serviceTestimonials}
        title={templateData.sectionHeadings.testimonials.title}
      />
    </>
  );
}
