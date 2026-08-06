function round(num: number): number {
  return Math.round(num);
}

export function calculateAopBusinessTax(amount: number): {
  tax: number;
  surcharge: number;
  totalTax: number;
} {
  let tax = 0;
  if (amount > 600000 && amount <= 1200000) {
    tax = (amount - 600000) * 0.15;
  } else if (amount > 1200000 && amount <= 1600000) {
    tax = 90000 + (amount - 1200000) * 0.20;
  } else if (amount > 1600000 && amount <= 3200000) {
    tax = 170000 + (amount - 1600000) * 0.30;
  } else if (amount > 3200000 && amount <= 5600000) {
    tax = 650000 + (amount - 3200000) * 0.40;
  } else if (amount > 5600000) {
    tax = 1610000 + (amount - 5600000) * 0.45;
  }

  const surcharge = amount > 10000000 ? round(tax * 0.10) : 0;
  const totalTax = round(tax) + surcharge;

  return { tax: round(tax), surcharge, totalTax };
}

export function calculatePunjabAgriculturalTax(amount: number): {
  tax: number;
  surcharge: number;
  totalTax: number;
} {
  let tax = 0;
  if (amount > 400000 && amount <= 800000) {
    tax = 1000;
  } else if (amount > 800000 && amount <= 1200000) {
    tax = 2000;
  } else if (amount > 1200000 && amount <= 2400000) {
    tax = (amount - 1200000) * 0.05;
  } else if (amount > 2400000 && amount <= 4800000) {
    tax = 60000 + (amount - 2400000) * 0.10;
  } else if (amount > 4800000) {
    tax = 300000 + (amount - 4800000) * 0.15;
  }

  return { tax: round(tax), surcharge: 0, totalTax: round(tax) };
}

function calculateStandardAgriculturalTax(amount: number): number {
  let tax = 0;
  if (amount > 600000 && amount <= 1200000) {
    tax = (amount - 600000) * 0.15;
  } else if (amount > 1200000 && amount <= 1600000) {
    tax = 90000 + (amount - 1200000) * 0.20;
  } else if (amount > 1600000 && amount <= 3200000) {
    tax = 170000 + (amount - 1600000) * 0.30;
  } else if (amount > 3200000 && amount <= 5600000) {
    tax = 650000 + (amount - 3200000) * 0.40;
  } else if (amount > 5600000) {
    tax = 1610000 + (amount - 5600000) * 0.45;
  }
  return tax;
}

export function calculateSindhAgriculturalTax(amount: number): {
  tax: number;
  surcharge: number;
  totalTax: number;
} {
  const tax = calculateStandardAgriculturalTax(amount);
  return { tax: round(tax), surcharge: 0, totalTax: round(tax) };
}

export function calculateKpkAgriculturalTax(amount: number): {
  tax: number;
  surcharge: number;
  totalTax: number;
} {
  const tax = calculateStandardAgriculturalTax(amount);
  return { tax: round(tax), surcharge: 0, totalTax: round(tax) };
}

export function calculateBalochistanAgriculturalTax(amount: number): {
  tax: number;
  surcharge: number;
  totalTax: number;
} {
  const tax = calculateStandardAgriculturalTax(amount);
  return { tax: round(tax), surcharge: 0, totalTax: round(tax) };
}

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: string;
  calculation: string;
}

export const AOP_SLABS: TaxSlab[] = [
  { min: 0, max: 600000, rate: "0%", calculation: "No tax" },
  { min: 600001, max: 1200000, rate: "15%", calculation: "15% of amount exceeding Rs. 600,000" },
  { min: 1200001, max: 1600000, rate: "20%", calculation: "Rs. 90,000 + 20% of amount exceeding Rs. 1,200,000" },
  { min: 1600001, max: 3200000, rate: "30%", calculation: "Rs. 170,000 + 30% of amount exceeding Rs. 1,600,000" },
  { min: 3200001, max: 5600000, rate: "40%", calculation: "Rs. 650,000 + 40% of amount exceeding Rs. 3,200,000" },
  { min: 5600001, max: null, rate: "45%", calculation: "Rs. 1,610,000 + 45% of amount exceeding Rs. 5,600,000" },
];

export const PUNJAB_AGRICULTURAL_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: "0%", calculation: "Exempt" },
  { min: 400001, max: 800000, rate: "Fixed", calculation: "Fixed Rs. 1,000" },
  { min: 800001, max: 1200000, rate: "Fixed", calculation: "Fixed Rs. 2,000" },
  { min: 1200001, max: 2400000, rate: "5%", calculation: "5% of amount exceeding Rs. 1,200,000" },
  { min: 2400001, max: 4800000, rate: "10%", calculation: "Rs. 60,000 + 10% of amount exceeding Rs. 2,400,000" },
  { min: 4800001, max: null, rate: "15%", calculation: "Rs. 300,000 + 15% of amount exceeding Rs. 4,800,000" },
];

export const STANDARD_AGRICULTURAL_SLABS: TaxSlab[] = [
  { min: 0, max: 600000, rate: "0%", calculation: "Exempt" },
  { min: 600001, max: 1200000, rate: "15%", calculation: "15% of amount exceeding Rs. 600,000" },
  { min: 1200001, max: 1600000, rate: "20%", calculation: "Rs. 90,000 + 20% of amount exceeding Rs. 1,200,000" },
  { min: 1600001, max: 3200000, rate: "30%", calculation: "Rs. 170,000 + 30% of amount exceeding Rs. 1,600,000" },
  { min: 3200001, max: 5600000, rate: "40%", calculation: "Rs. 650,000 + 40% of amount exceeding Rs. 3,200,000" },
  { min: 5600001, max: null, rate: "45%", calculation: "Rs. 1,610,000 + 45% of amount exceeding Rs. 5,600,000" },
];

export const SLAB_MAP: Record<string, { slabs: TaxSlab[]; title: string }> = {
  business: { slabs: AOP_SLABS, title: "AOP & Business (Non-Salaried) Tax Slabs" },
  "punjab-agricultural": { slabs: PUNJAB_AGRICULTURAL_SLABS, title: "Punjab Agricultural Income Tax Slabs" },
  "sindh-agricultural": { slabs: STANDARD_AGRICULTURAL_SLABS, title: "Sindh Agricultural Income Tax Slabs" },
  "kpk-agricultural": { slabs: STANDARD_AGRICULTURAL_SLABS, title: "KPK Agricultural Income Tax Slabs" },
  "balochistan-agricultural": { slabs: STANDARD_AGRICULTURAL_SLABS, title: "Balochistan Agricultural Income Tax Slabs" },
};

export { formatCurrency } from "./taxCalculator";
