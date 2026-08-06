"use client";

import { useState } from "react";
import PublicHeader from "../layout/PublicHeader";
import HeroSection from "./HeroSection";
import OtherTaxCalculators from "./OtherTaxCalculators";
import ValueProposition from "./ValueProposition";
import WhyChooseUs from "./WhyChooseUs";
import Services from "./Services";
import Testimonials from "./Testimonials";
import ConsultationCTA from "./ConsultationCTA";
import Footer from "../layout/Footer";

type CalculatorType = "salaried" | "business" | "punjab" | "sindh" | "kpk" | "balochistan";

export default function HomePage() {
  const [calcType, setCalcType] = useState<CalculatorType>("salaried");

  return (
    <main className="min-h-screen overflow-x-hidden">
      <PublicHeader />
      <HeroSection calcType={calcType} setCalcType={setCalcType} />
      <OtherTaxCalculators calcType={calcType} setCalcType={setCalcType} />
      <ValueProposition />
      <WhyChooseUs />
      <Services />
      <Testimonials />
      <ConsultationCTA />
      <Footer />
    </main>
  );
}
