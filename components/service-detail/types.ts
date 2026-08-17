import type { LucideIcon } from "lucide-react";

export interface TextItem {
  text: string;
}

export interface IncludedService {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface DocumentRequirement {
  applicantType: string;
  icon: LucideIcon;
  documents: string[];
}

export interface TimelineMetric {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface WhyChooseFeature {
  title: string;
  description?: string;
  icon: LucideIcon;
}

export interface ServiceTestimonial {
  name: string;
  designation: string;
  content: string;
  avatar: string;
}

export interface SectionHeadings {
  struggle: {
    beforeHighlight: string;
    highlight: string;
  };
  servicesInclude: {
    beforeHighlight: string;
    highlight: string;
    afterHighlight: string;
  };
  process: {
    beforeHighlight: string;
    highlight: string;
  };
  whyChoose: {
    beforeHighlight: string;
    highlight: string;
  };
  testimonials: {
    title: string;
  };
  documentsTimeline: {
    requiredDocs: string;
    timeRequired: string;
  };
}

export interface CtaBanner {
  title: string;
  highlight: string;
  description: string;
  applyButtonText: string;
  phoneNumber: string;
  whatsappNumber: string;
  callButtonText: string;
  whatsappButtonText: string;
}

export interface TemplateData {
  solutionIntro: string;
  commonProblems: TextItem[];
  solutions: TextItem[];
  includedServices: { title: string; description: string; icon: string }[];
  processSteps: { step: number; title: string; description: string; icon: string }[];
  documentRequirements: { applicantType: string; icon: string; documents: string[] }[];
  timelineMetrics: { label: string; value: string; icon: string }[];
  fastProcessingText: string;
  whyChooseFeatures: { title: string; description?: string; icon: string }[];
  serviceTestimonials: ServiceTestimonial[];
  sectionHeadings: SectionHeadings;
  ctaBanner: CtaBanner;
}
