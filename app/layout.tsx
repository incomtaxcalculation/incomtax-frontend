import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col font-sans max-w-screen overflow-x-hidden">
        <AppProvider>
          <ImageModalProvider>
            <RootContent>{children}</RootContent>
          </ImageModalProvider>
        </AppProvider>
      </body>
    </html>
  );
}
