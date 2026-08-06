"use client";

function round(num: number): number {
  return Math.round(num);
}

function calculateTax14to15(amount: number): number {
  let taxAmount = 0;
  if (amount > 400000 && amount <= 750000) {
    amount -= 400000;
    taxAmount = amount * 0.05;
  } else if (amount > 750000 && amount <= 1400000) {
    amount -= 750000;
    taxAmount = 17500 + amount * 0.1;
  } else if (amount > 1400000 && amount <= 1500000) {
    amount -= 1400000;
    taxAmount = 82500 + amount * 0.125;
  } else if (amount > 1500000 && amount <= 1800000) {
    amount -= 1500000;
    taxAmount = 95000 + amount * 0.15;
  } else if (amount > 1800000 && amount <= 2500000) {
    amount -= 1800000;
    taxAmount = 140000 + amount * 0.175;
  } else if (amount > 2500000 && amount < 3000000) {
    amount -= 2500000;
    taxAmount = 262500 + amount * 0.2;
  } else if (amount > 3000000 && amount < 3500000) {
    amount -= 3000000;
    taxAmount = 362500 + amount * 0.225;
  } else if (amount > 3500000 && amount < 4000000) {
    amount -= 3500000;
    taxAmount = 475000 + amount * 0.25;
  } else if (amount > 4000000 && amount < 7000000) {
    amount -= 4000000;
    taxAmount = 600000 + amount * 0.275;
  } else if (amount > 7000000) {
    amount -= 7000000;
    taxAmount = 1425000 + amount * 0.3;
  }
  return round(taxAmount);
}

function calculateTax15to16(amount: number): number {
  let taxAmount = 0;
  if (amount > 400000 && amount <= 500000) {
    amount -= 400000;
    taxAmount = amount * 0.02;
  } else if (amount > 500000 && amount <= 750000) {
    amount -= 500000;
    taxAmount = 2000 + amount * 0.05;
  } else if (amount > 750000 && amount <= 1400000) {
    amount -= 750000;
    taxAmount = 14500 + amount * 0.1;
  } else if (amount > 1400000 && amount <= 1500000) {
    amount -= 1400000;
    taxAmount = 79500 + amount * 0.125;
  } else if (amount > 1500000 && amount <= 1800000) {
    amount -= 1500000;
    taxAmount = 92000 + amount * 0.15;
  } else if (amount > 1800000 && amount < 2500000) {
    amount -= 1800000;
    taxAmount = 137000 + amount * 0.175;
  } else if (amount > 2500000 && amount < 3000000) {
    amount -= 2500000;
    taxAmount = 259500 + amount * 0.2;
  } else if (amount > 3000000 && amount < 3500000) {
    amount -= 3000000;
    taxAmount = 359500 + amount * 0.225;
  } else if (amount > 3500000 && amount < 4000000) {
    amount -= 3500000;
    taxAmount = 472000 + amount * 0.25;
  } else if (amount > 4000000 && amount < 7000000) {
    amount -= 4000000;
    taxAmount = 597000 + amount * 0.275;
  } else if (amount > 7000000) {
    amount -= 7000000;
    taxAmount = 1422000 + amount * 0.3;
  }
  return round(taxAmount);
}

const calculateTax16to17 = calculateTax15to16;
const calculateTax17to18 = calculateTax15to16;

function calculateTax18to19(amount: number): number {
  let taxAmount = 0;
  if (amount > 400000 && amount <= 800000) {
    taxAmount = 1000;
  } else if (amount > 800000 && amount <= 1200000) {
    taxAmount = 2000;
  } else if (amount > 1200000 && amount <= 2500000) {
    amount -= 1200000;
    const taxAmount1 = amount * 0.05;
    const taxAmount2 = 2000;
    taxAmount = taxAmount1 > taxAmount2 ? taxAmount1 : taxAmount2;
  } else if (amount > 2500000 && amount <= 4000000) {
    amount -= 2500000;
    taxAmount = 65000 + amount * 0.15;
  } else if (amount > 4000000 && amount <= 8000000) {
    amount -= 4000000;
    taxAmount = 290000 + amount * 0.2;
  } else if (amount > 8000000) {
    amount -= 8000000;
    taxAmount = 1090000 + amount * 0.25;
  }
  return round(taxAmount);
}

function calculateTax19to20(amount: number): number {
  let taxAmount = 0;
  if (amount > 600000 && amount <= 1200000) {
    amount -= 600000;
    taxAmount = amount * 0.05;
  } else if (amount > 1200000 && amount <= 1800000) {
    amount -= 1200000;
    taxAmount = 30000 + amount * 0.1;
  } else if (amount > 1800000 && amount <= 2500000) {
    amount -= 1800000;
    taxAmount = 90000 + amount * 0.15;
  } else if (amount > 2500000 && amount <= 3500000) {
    amount -= 2500000;
    taxAmount = 195000 + amount * 0.175;
  } else if (amount > 3500000 && amount <= 5000000) {
    amount -= 3500000;
    taxAmount = 370000 + amount * 0.2;
  } else if (amount > 5000000 && amount <= 8000000) {
    amount -= 5000000;
    taxAmount = 670000 + amount * 0.225;
  } else if (amount > 8000000 && amount <= 12000000) {
    amount -= 8000000;
    taxAmount = 1345000 + amount * 0.25;
  } else if (amount > 12000000 && amount <= 30000000) {
    amount -= 12000000;
    taxAmount = 2345000 + amount * 0.275;
  } else if (amount > 30000000 && amount <= 50000000) {
    amount -= 30000000;
    taxAmount = 7295000 + amount * 0.3;
  } else if (amount > 50000000 && amount <= 75000000) {
    amount -= 50000000;
    taxAmount = 13295000 + amount * 0.325;
  } else if (amount > 75000000) {
    amount -= 75000000;
    taxAmount = 21420000 + amount * 0.35;
  }
  return round(taxAmount);
}

const calculateTax20to21 = calculateTax19to20;
const calculateTax21to22 = calculateTax19to20;

function calculateTax22to23(amount: number): number {
  let taxAmount = 0;
  if (amount > 600000 && amount <= 1200000) {
    amount -= 600000;
    taxAmount = amount * 0.025;
  } else if (amount > 1200000 && amount <= 2400000) {
    amount -= 1200000;
    taxAmount = 15000 + amount * 0.125;
  } else if (amount > 2400000 && amount <= 3600000) {
    amount -= 2400000;
    taxAmount = 165000 + amount * 0.2;
  } else if (amount > 3600000 && amount <= 6000000) {
    amount -= 3600000;
    taxAmount = 405000 + amount * 0.25;
  } else if (amount > 6000000 && amount <= 12000000) {
    amount -= 6000000;
    taxAmount = 1005000 + amount * 0.325;
  } else if (amount > 12000000) {
    amount -= 12000000;
    taxAmount = 2955000 + amount * 0.35;
  }
  return round(taxAmount);
}

function calculateTax23to24(amount: number): number {
  let taxAmount = 0;
  if (amount > 600000 && amount <= 1200000) {
    amount -= 600000;
    taxAmount = amount * 0.025;
  } else if (amount > 1200000 && amount <= 2400000) {
    amount -= 1200000;
    taxAmount = 15000 + amount * 0.125;
  } else if (amount > 2400000 && amount <= 3600000) {
    amount -= 2400000;
    taxAmount = 165000 + amount * 0.225;
  } else if (amount > 3600000 && amount <= 6000000) {
    amount -= 3600000;
    taxAmount = 435000 + amount * 0.275;
  } else if (amount > 6000000) {
    amount -= 6000000;
    taxAmount = 1095000 + amount * 0.35;
  }
  return round(taxAmount);
}

function calculateTax24to25(amount: number): number {
  let taxAmount = 0;
  if (amount > 600000 && amount <= 1200000) {
    amount -= 600000;
    taxAmount = amount * 0.05;
  } else if (amount > 1200000 && amount <= 2200000) {
    amount -= 1200000;
    taxAmount = 30000 + amount * 0.15;
  } else if (amount > 2200000 && amount <= 3200000) {
    amount -= 2200000;
    taxAmount = 180000 + amount * 0.25;
  } else if (amount > 3200000 && amount <= 4100000) {
    amount -= 3200000;
    taxAmount = 430000 + amount * 0.3;
  } else if (amount > 4100000) {
    amount -= 4100000;
    taxAmount = 700000 + amount * 0.35;
  }
  return round(taxAmount);
}

function calculateTax25to26(amount: number): number {
  const originalAmount = amount;
  let taxAmount = 0;
  if (amount > 600000 && amount <= 1200000) {
    amount -= 600000;
    taxAmount = amount * 0.01;
  } else if (amount > 1200000 && amount <= 2200000) {
    amount -= 1200000;
    taxAmount = 6000 + amount * 0.11;
  } else if (amount > 2200000 && amount <= 3200000) {
    amount -= 2200000;
    taxAmount = 116000 + amount * 0.23;
  } else if (amount > 3200000 && amount <= 4100000) {
    amount -= 3200000;
    taxAmount = 346000 + amount * 0.30;
  } else if (amount > 4100000) {
    amount -= 4100000;
    taxAmount = 616000 + amount * 0.35;
  }

  if (originalAmount > 10000000) {
    taxAmount = taxAmount * 1.09;
  }

  return round(taxAmount);
}

export type TaxYear = 
  | "2014-2015" | "2015-2016" | "2016-2017" | "2017-2018" | "2018-2019"
  | "2019-2020" | "2020-2021" | "2021-2022" | "2022-2023" | "2023-2024"
  | "2024-2025" | "2025-2026";

export interface TaxResult {
  yearlyIncome: number;
  monthlyIncome: number;
  yearlyTax: number;
  monthlyTax: number;
  yearlyIncomeAfterTax: number;
  monthlyIncomeAfterTax: number;
}

const taxFunctions: Record<TaxYear, (amount: number) => number> = {
  "2014-2015": calculateTax14to15,
  "2015-2016": calculateTax15to16,
  "2016-2017": calculateTax16to17,
  "2017-2018": calculateTax17to18,
  "2018-2019": calculateTax18to19,
  "2019-2020": calculateTax19to20,
  "2020-2021": calculateTax20to21,
  "2021-2022": calculateTax21to22,
  "2022-2023": calculateTax22to23,
  "2023-2024": calculateTax23to24,
  "2024-2025": calculateTax24to25,
  "2025-2026": calculateTax25to26,
};

export function calculateTax(salary: number, year: TaxYear): TaxResult {
  const yearlyIncome = salary;
  const monthlyIncome = salary / 12;
  const yearlyTax = taxFunctions[year](yearlyIncome);
  const monthlyTax = yearlyTax / 12;
  const yearlyIncomeAfterTax = yearlyIncome - yearlyTax;
  const monthlyIncomeAfterTax = monthlyIncome - monthlyTax;

  return {
    yearlyIncome: round(yearlyIncome),
    monthlyIncome: round(monthlyIncome),
    yearlyTax: round(yearlyTax),
    monthlyTax: round(monthlyTax),
    yearlyIncomeAfterTax: round(yearlyIncomeAfterTax),
    monthlyIncomeAfterTax: round(monthlyIncomeAfterTax),
  };
}

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export const TAX_YEARS: TaxYear[] = [
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2020-2021",
  "2019-2020",
  "2018-2019",
  "2017-2018",
  "2016-2017",
  "2015-2016",
  "2014-2015",
];

export const CURRENT_TAX_YEAR: TaxYear = "2025-2026";
