"use client";

import React from "react";
import {
  User,
  Briefcase,
  Leaf,
  Landmark,
  Mountain,
  Component,
} from "lucide-react";

type CalculatorType = "salaried" | "business" | "punjab" | "sindh" | "kpk" | "balochistan";

const calculators: { icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; title: string; subTitle: string; type: CalculatorType }[] = [
  {
    icon: User,
    title: "Income Tax",
    subTitle: "(Salaried)",
    type: "salaried",
  },
  {
    icon: Briefcase,
    title: "AOP & Business",
    subTitle: "(Non-Salaried)",
    type: "business",
  },
  {
    icon: Leaf,
    title: "Punjab Agricultural",
    subTitle: "Income Tax",
    type: "punjab",
  },
  {
    icon: Landmark,
    title: "Sindh Agricultural",
    subTitle: "Income Tax",
    type: "sindh",
  },
  {
    icon: Mountain,
    title: "KPK Agricultural",
    subTitle: "Income Tax",
    type: "kpk",
  },
  {
    icon: Component,
    title: "Balochistan Agricultural",
    subTitle: "Income Tax",
    type: "balochistan",
  },
];

export default function OtherTaxCalculators({
  calcType,
  setCalcType,
}: {
  calcType: CalculatorType;
  setCalcType: (type: CalculatorType) => void;
}) {
  const handleCalculatorClick = (type: CalculatorType) => {
    setCalcType(type);
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0a3d3d] mb-1">
            Other Tax Calculators
          </h2>
          <p className="text-sm text-gray-500">
            Choose a category to calculate your tax
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {calculators.map((calculator, index) => {
            const Icon = calculator.icon;
            const isActive = calculator.type === calcType;
            return (
              <button
                key={index}
                onClick={() => handleCalculatorClick(calculator.type)}
                className="text-left w-full"
              >
                <div className={`h-full rounded-xl p-6 border transition-all duration-300 flex flex-col items-center text-center ${isActive ? "bg-[#0d7a7a] border-[#0d7a7a] shadow-md scale-105" : "bg-white border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-md hover:scale-105"}`}>
                  <div className={`mb-4 transition-transform duration-300 ${isActive ? "text-white scale-110" : "text-[#0d7a7a]"}`}>
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-[13px] font-bold leading-tight ${isActive ? "text-white" : "text-[#0a3d3d]"}`}>
                      {calculator.title}
                    </p>
                    <p className={`text-[12px] leading-tight ${isActive ? "text-white/80" : "text-[#0a3d3d] opacity-80"}`}>
                      {calculator.subTitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}