import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title:
    "Pakistan Income Tax Calculator 2026-2027 | Free FBR Tax Calculator for Salaried Individuals",
  description:
    "Calculate your income tax in Pakistan instantly with our free FBR tax calculator. Updated for 2026-2027 budget. Supports salaried tax slabs from 2014-15 to 2026-27 with 9% surcharge on income above Rs. 10 million.",
  keywords: [
    "Pakistan income tax calculator",
    "FBR tax calculator 2026-2027",
    "salary tax calculator Pakistan",
    "income tax slabs Pakistan",
    "tax calculator for salaried persons",
    "Pakistan tax year 2026-2027",
    "monthly tax calculator Pakistan",
    "FBR income tax rates",
    "tax on salary Pakistan",
    "Pakistan tax slabs 2026-2027",
    "free tax calculator Pakistan",
    "income tax return Pakistan",
    "salaried tax calculator",
    "Pakistan budget 2026-2027 tax",
    "tax consultant Pakistan",
  ],
  authors: [{ name: "Navigate Business" }],
  creator: "Navigate Business",
  publisher: "Navigate Business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://navigatebusinesses.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://navigatebusinesses.com",
    title:
      "Pakistan Income Tax Calculator 2026-2027 | Free FBR Tax Calculator",
    description:
      "Calculate your income tax in Pakistan instantly with our free FBR tax calculator. Updated for 2026-2027 budget with new tax slabs for salaried individuals.",
    siteName: "Navigate Business - Tax Calculator Pakistan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pakistan Income Tax Calculator 2026-2027 - Navigate Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Pakistan Income Tax Calculator 2026-2027 | Free FBR Tax Calculator",
    description:
      "Calculate your income tax in Pakistan instantly with our free FBR tax calculator. Updated for 2026-2027 budget.",
    images: ["/og-image.jpg"],
    creator: "@navigatebusiness",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return <HomePage />;
}
