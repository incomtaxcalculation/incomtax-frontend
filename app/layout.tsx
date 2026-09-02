import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import { ImageModalProvider } from "@/context/ImageModalContext";
import { GlobalImageModal } from "@/components/layout/GlobalImageModal";
import { ThemeProvider } from "@/components/theme-provider";
import { ProgressBar } from "@/components/ProgressBar";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const GTM_ID = "GTM-MDQ8RLGH";
export const metadata: Metadata = {
  title: {
    default: "Tax Calculator Pakistan | Navigate Business",
    template: "%s | Navigate Business",
  },
  description:
    "Expert tax consulting and calculation services in Pakistan. Income tax calculator, FBR compliance, tax filing, and business registration services.",
  keywords: [
    "tax calculator Pakistan",
    "income tax",
    "FBR",
    "tax filing",
    "tax consultant",
    "business registration",
  ],
  authors: [{ name: "Navigate Business" }],
  creator: "Navigate Business",
  publisher: "Navigate Business",
  metadataBase: new URL("https://navigatebusinesses.com"),
};


function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBar />
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-right" closeButton />
      <GlobalImageModal />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
    <head>
      <meta name="google-site-verification" content="NJGnkEAD1nW38oVfJfAn9XNILVf2Zh0wJeWS25zcTa4" />
      <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
      </Script>
      <meta name="google-site-verification" content="NJGnkEAD1nW38oVfJfAn9XNILVf2Zh0wJeWS25zcTa4" />
  </head>
      <body className="min-h-full flex flex-col font-sans max-w-screen overflow-x-hidden">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <AppProvider>
          <ImageModalProvider>
            <RootContent>{children}</RootContent>
          </ImageModalProvider>
        </AppProvider>
      </body>
    </html>
  );
}
