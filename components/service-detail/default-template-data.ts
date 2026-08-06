import type { TemplateData } from "./types";

const defaultTemplateData: TemplateData = {
  solutionIntro: "",
  commonProblems: [],
  solutions: [],
  includedServices: [],
  processSteps: [],
  documentRequirements: [],
  timelineMetrics: [],
  fastProcessingText: "",
  whyChooseFeatures: [],
  serviceTestimonials: [],
  sectionHeadings: {
    struggle: {
      beforeHighlight: "Why People Struggle With",
      highlight: "Registration",
    },
    servicesInclude: {
      beforeHighlight: "Our",
      highlight: "Services",
      afterHighlight: " Include",
    },
    process: {
      beforeHighlight: "Our Simple",
      highlight: "Process",
    },
    whyChoose: {
      beforeHighlight: "Why Choose",
      highlight: "Us?",
    },
    testimonials: {
      title: "What Our Clients Say",
    },
    documentsTimeline: {
      requiredDocs: "Required Documents",
      timeRequired: "Time Required",
    },
  },
  ctaBanner: {
    title: "Ready to Register Your",
    highlight: "Service?",
    description: "Get professional assistance today.",
    applyButtonText: "Apply Now",
    phoneNumber: "+923137937530",
    whatsappNumber: "923137937530",
    callButtonText: "Call Now",
    whatsappButtonText: "WhatsApp Us",
  },
};

export default defaultTemplateData;
