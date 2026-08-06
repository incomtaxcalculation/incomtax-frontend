import type { Metadata } from "next";
import ServicesPage from "@/components/ServicesPage";

export const metadata: Metadata = {
  title: "Our Services | Navigate Business",
  description:
    "Explore our comprehensive range of tax, finance, and compliance services including income tax registration, sales tax, audit, bookkeeping, company registration, trademark, and more.",
  openGraph: {
    title: "Our Services | Navigate Business",
    description:
      "Expert tax, finance, and compliance services tailored for businesses and individuals in Pakistan.",
    url: "https://navigatebusinesses.com/services",
    siteName: "Navigate Business",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Navigate Business Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services | Navigate Business",
    description:
      "Expert tax, finance, and compliance services tailored for businesses and individuals in Pakistan.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ServicesPage />;
}
