import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us | Navigate Business - Tax & Finance Experts in Pakistan",
  description:
    "Navigate Business is a leading tax, finance, and compliance consultancy in Pakistan. With years of experience in income tax, sales tax, company registration, and audit services, we help businesses thrive.",
  openGraph: {
    title: "About Us | Navigate Business",
    description:
      "Expert tax, finance, and compliance consultancy serving businesses and individuals across Pakistan.",
    url: "https://navigatebusinesses.com/about",
    siteName: "Navigate Business",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Navigate Business",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Navigate Business",
    description:
      "Expert tax, finance, and compliance consultancy serving businesses and individuals across Pakistan.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <AboutPage />;
}
