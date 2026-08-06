"use client";

import { useState, useMemo, useEffect } from "react";
import Script from "next/script";
import { CheckCircle2, ShieldCheck, Zap, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  calculateTax,
  formatCurrency,
  TAX_YEARS,
  CURRENT_TAX_YEAR,
  type TaxYear,
} from "@/lib/taxCalculator";
import {
  calculateAopBusinessTax,
  calculatePunjabAgriculturalTax,
  calculateSindhAgriculturalTax,
  calculateKpkAgriculturalTax,
  calculateBalochistanAgriculturalTax,
} from "@/lib/otherTaxCalculators";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Pakistan Income Tax Calculator",
      url: "https://navigatebusinesses.com",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      description:
        "Calculate your income tax in Pakistan instantly with the latest FBR tax slabs for salaried individuals. Supports tax years from 2014-15 to 2025-26.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PKR",
      },
      author: {
        "@type": "Organization",
        name: "Navigate Business",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is income tax calculated for salaried persons in Pakistan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Income tax for salaried persons in Pakistan is calculated using progressive tax slabs set by FBR. The tax rate increases as income rises, with the first Rs. 600,000 being tax-free for tax year 2025-2026. Income above Rs. 4,100,000 is taxed at 35% with a 9% surcharge on income exceeding Rs. 10,000,000.",
          },
        },
        {
          "@type": "Question",
          name: "What is the tax-free income limit in Pakistan for 2025-2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For tax year 2025-2026, the tax-free income limit for salaried individuals in Pakistan is Rs. 600,000 per year. Income up to this threshold is exempt from income tax under the new FBR tax slabs.",
          },
        },
        {
          "@type": "Question",
          name: "What are the FBR tax slabs for salaried persons 2025-2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For tax year 2025-2026: Up to Rs. 600,000 – 0% tax; Rs. 600,001 to Rs. 1,200,000 – 1% of amount exceeding Rs. 600,000; Rs. 1,200,001 to Rs. 2,200,000 – Rs. 6,000 + 11%; Rs. 2,200,001 to Rs. 3,200,000 – Rs. 116,000 + 23%; Rs. 3,200,001 to Rs. 4,100,000 – Rs. 346,000 + 30%; Above Rs. 4,100,000 – Rs. 616,000 + 35%. A 9% surcharge applies on taxable income exceeding Rs. 10,000,000.",
          },
        },
        {
          "@type": "Question",
          name: "How much tax will I pay on a salary of Rs. 100,000 per month in Pakistan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "On a monthly salary of Rs. 100,000 (Rs. 1,200,000 yearly) for tax year 2025-2026, you would pay approximately Rs. 6,000 in yearly tax, which is Rs. 500 per month. This is calculated as per the FBR tax slabs: Rs. 6,000 + 11% of amount exceeding Rs. 1,200,000.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://navigatebusinesses.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Income Tax Calculator Pakistan",
          item: "https://navigatebusinesses.com",
        },
      ],
    },
  ],
};

type CalculatorType = "salaried" | "business" | "punjab" | "sindh" | "kpk" | "balochistan";

interface CalcMeta {
  label: string;
  title: string;
  desc: string;
  incomeLabel: string;
}

const CALC_TYPES: Record<CalculatorType, CalcMeta> = {
  salaried: {
    label: "Salaried",
    title: "Income Tax Calculator Pakistan",
    desc: "Free Pakistan income tax calculator for salaried persons as per latest FBR tax slabs and government budget 2025-2026.",
    incomeLabel: "Salary / Income",
  },
  business: {
    label: "AOP & Business",
    title: "AOP & Business Tax Calculator",
    desc: "Calculate income tax for Associations of Persons (AOPs) and non-salaried individuals as per FBR tax rates 2025-2026.",
    incomeLabel: "Business Income",
  },
  punjab: {
    label: "Punjab Agricultural",
    title: "Punjab Agricultural Tax Calculator",
    desc: "Calculate agricultural income tax for Punjab province as per latest Punjab Agricultural Income Tax rates.",
    incomeLabel: "Agricultural Income",
  },
  sindh: {
    label: "Sindh Agricultural",
    title: "Sindh Agricultural Tax Calculator",
    desc: "Calculate agricultural income tax for Sindh province as per latest rates.",
    incomeLabel: "Agricultural Income",
  },
  kpk: {
    label: "KPK Agricultural",
    title: "KPK Agricultural Tax Calculator",
    desc: "Calculate agricultural income tax for Khyber Pakhtunkhwa province as per latest rates.",
    incomeLabel: "Agricultural Income",
  },
  balochistan: {
    label: "Balochistan Agricultural",
    title: "Balochistan Agricultural Tax Calculator",
    desc: "Calculate agricultural income tax for Balochistan province as per latest rates.",
    incomeLabel: "Agricultural Income",
  },
};

const MAX_INCOME = 10000000000;

export default function TaxHero({
  calcType,
  setCalcType,
}: {
  calcType: CalculatorType;
  setCalcType: (type: CalculatorType) => void;
}) {
  const [mode, setMode] = useState<"monthly" | "yearly">("monthly");
  const [incomeInput, setIncomeInput] = useState("");

  useEffect(() => {
    setIncomeInput("");
  }, [calcType]);
  const [selectedYear, setSelectedYear] = useState<TaxYear>(CURRENT_TAX_YEAR);

  const meta = CALC_TYPES[calcType];
  const isSalaried = calcType === "salaried";

  const numericValue = useMemo(() => {
    const cleaned = incomeInput.replace(/\D/g, "");
    const parsed = cleaned ? parseInt(cleaned, 10) : 0;
    return parsed > MAX_INCOME ? MAX_INCOME : parsed;
  }, [incomeInput]);

  const yearlyIncome = useMemo(() => {
    return mode === "monthly" ? numericValue * 12 : numericValue;
  }, [numericValue, mode]);

  const result = useMemo(() => {
    if (yearlyIncome <= 0) return null;
    if (isSalaried) {
      return calculateTax(yearlyIncome, selectedYear);
    }
    const calcMap: Record<CalculatorType, (a: number) => { totalTax: number }> = {
      salaried: () => ({ totalTax: 0 }),
      business: calculateAopBusinessTax,
      punjab: calculatePunjabAgriculturalTax,
      sindh: calculateSindhAgriculturalTax,
      kpk: calculateKpkAgriculturalTax,
      balochistan: calculateBalochistanAgriculturalTax,
    };
    const calc = calcMap[calcType](yearlyIncome);
    const monthlyTax = calc.totalTax / 12;
    return {
      yearlyIncome: Math.round(yearlyIncome),
      monthlyIncome: Math.round(yearlyIncome / 12),
      yearlyTax: Math.round(calc.totalTax),
      monthlyTax: Math.round(monthlyTax),
      yearlyIncomeAfterTax: Math.round(yearlyIncome - calc.totalTax),
      monthlyIncomeAfterTax: Math.round(yearlyIncome / 12 - monthlyTax),
    };
  }, [yearlyIncome, calcType, selectedYear, isSalaried]);

  const label = mode === "monthly" ? "Monthly" : "Yearly";
  const showYearSelect = isSalaried;
  const showSurcharge = isSalaried && numericValue > 0 && result && selectedYear === "2025-2026" && yearlyIncome > 10000000;

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section id="hero-section" className="bg-[#f4f7f6] py-12 flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-start">
          <div className="space-y-4 w-full lg:w-[30%]">
            <div className="inline-block px-4 py-1 rounded-full bg-[#e1eded] text-[#086868] text-sm font-semibold border border-[#c5dfdf]">
              Budget 2025-2026
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#0a3d3d] leading-tight">
              <span className="text-black text-2xl md:text-3xl">
                Calculate Your
              </span>
              <br />
              <span className="text-[#0d7a7a]">Tax in Pakistan</span>
            </h1>

            <p className="text-gray-600 text-lg max-w-md">{meta.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CheckCircle2 className="text-[#0d7a7a] w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-none">
                    100% Updated
                  </p>
                  <p className="text-xs text-[#5c6575]">2025-2026 Rates</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Zap className="text-[#0d7a7a] w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-none">
                    Instant & Accurate
                  </p>
                  <p className="text-xs text-[#5c6575]">Calculations</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ShieldCheck className="text-[#0d7a7a] w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-none">
                    Trusted by
                  </p>
                  <p className="text-xs text-[#5c6575]">Thousands</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row w-full lg:w-[70%]">
            <div className="p-4 md:p-6 lg:p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {meta.title}
              </h2>

              <Tabs
                defaultValue="monthly"
                className="w-full mb-6"
                onValueChange={(value) =>
                  setMode(value as "monthly" | "yearly")
                }
              >
                <TabsList className="grid h-12 w-full grid-cols-2 rounded-full bg-gray-50 border border-gray-100 p-1">
                  <TabsTrigger
                    value="monthly"
                    className="rounded-full data-[state=active]:bg-[#0d7a7a] data-[state=active]:text-white data-[state=active]:shadow-md transition-all text-gray-500 font-medium"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="rounded-full data-[state=active]:bg-[#0d7a7a] data-[state=active]:text-white data-[state=active]:shadow-md transition-all text-gray-500 font-medium"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="hidden" />
                <TabsContent value="yearly" className="hidden" />
              </Tabs>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                    {label} {meta.incomeLabel} (PKR)
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder={`Enter ${label.toLowerCase()} amount`}
                      value={incomeInput}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, "");
                        const num = parseInt(cleaned, 10);
                        if (num > MAX_INCOME) return;
                        setIncomeInput(cleaned);
                      }}
                      className="h-12 border-gray-200 focus:ring-[#0d7a7a]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#656d7d] text-sm">
                      Rs.
                    </span>
                  </div>
                </div>

                {showYearSelect && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                      Select Tax Year
                    </label>
                    <Select
                      value={selectedYear}
                      onValueChange={(value) =>
                        setSelectedYear(value as TaxYear)
                      }
                    >
                      <SelectTrigger aria-label="Select Tax Year" className="h-12! w-full border-gray-200">
                        <SelectValue placeholder="Tax Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAX_YEARS.map((year) => (
                          <SelectItem key={year} className="h-12!" value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {calcType === "business" && numericValue > 0 && yearlyIncome > 10000000 && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">
                      10% surcharge applied on tax payable as income exceeds Rs. 10,000,000.
                    </p>
                  </div>
                )}

                {showSurcharge && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">
                      9% surcharge applied on taxable income exceeding Rs. 10,000,000 as per FBR regulations for 2025-2026.
                    </p>
                  </div>
                )}

                <p className="text-[10px] text-[#656d7d] mt-4 leading-tight">
                  Results are estimates for reference only. Consult a tax professional for accurate filing.
                </p>

                <button
                  onClick={() => document.getElementById("tax-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="mt-4 w-full py-3 px-6 bg-[#0d7a7a] text-white font-semibold rounded-lg hover:bg-[#0a6464] transition-colors"
                >
                  Calculate Tax
                </button>
              </div>
            </div>

            <div id="tax-results" className="p-8 bg-[#fafcfc] flex-1">
              <h3 className="text-xl font-bold text-gray-800">
                Tax Calculation Results
              </h3>

              <hr className="my-6" />

              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{label} Income</span>
                  <span className="font-semibold text-gray-700 font-mono">
                    {formatCurrency(
                      result
                        ? mode === "monthly"
                          ? result.monthlyIncome
                          : result.yearlyIncome
                        : 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{label} Tax</span>
                  <span className="font-semibold text-red-600 font-mono">
                    {result
                      ? `-${formatCurrency(
                          mode === "monthly"
                            ? result.monthlyTax
                            : result.yearlyTax
                        )}`
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{label} Income After Tax</span>
                  <span className="font-semibold text-green-700 font-mono">
                    {formatCurrency(
                      result
                        ? mode === "monthly"
                          ? result.monthlyIncomeAfterTax
                          : result.yearlyIncomeAfterTax
                        : 0
                    )}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {mode === "monthly" ? "Yearly" : "Monthly"} Income
                  </span>
                  <span className="font-semibold text-gray-700 font-mono">
                    {formatCurrency(
                      result
                        ? mode === "monthly"
                          ? result.yearlyIncome
                          : result.monthlyIncome
                        : 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {mode === "monthly" ? "Yearly" : "Monthly"} Tax
                  </span>
                  <span className="font-semibold text-red-600 font-mono">
                    {result
                      ? `-${formatCurrency(
                          mode === "monthly"
                            ? result.yearlyTax
                            : result.monthlyTax
                        )}`
                      : formatCurrency(0)}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-[#0d7a7a] font-bold text-lg">
                    {mode === "monthly" ? "Yearly" : "Monthly"} Income After Tax
                  </span>
                  <span className="text-[#0d7a7a] font-bold text-lg md:text-xl lg:text-2xl font-mono">
                    {formatCurrency(
                      result
                        ? mode === "monthly"
                          ? result.yearlyIncomeAfterTax
                          : result.monthlyIncomeAfterTax
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
