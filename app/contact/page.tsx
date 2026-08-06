import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Navigate Business - Get in Touch",
  description:
    "Get in touch with Navigate Business for expert tax, finance, and compliance services in Pakistan. Call us at +92 313 7937530 or email contact@navigatebusinesses.com.",
  openGraph: {
    title: "Contact Us | Navigate Business",
    description:
      "Reach out to Navigate Business for professional tax, finance, and compliance solutions across Pakistan.",
    url: "https://navigatebusinesses.com/contact",
    siteName: "Navigate Business",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Navigate Business",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Navigate Business",
    description:
      "Reach out to Navigate Business for professional tax, finance, and compliance solutions across Pakistan.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <ContactPage />;
}
