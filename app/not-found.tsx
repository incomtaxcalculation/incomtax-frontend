import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Home, ArrowLeft, FileSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Navigate Business",
  description:
    "The page you are looking for does not exist. Use our free Pakistan income tax calculator or return to the homepage.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-[#0d7a7a] font-semibold text-sm tracking-widest uppercase">
            404 Error
          </p>
          <h1 className="text-6xl md:text-7xl font-bold text-[#0a3d3d]">
            Page Not Found
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            The page you are looking for was moved, removed, or might have never
            existed. Let us help you find your way.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700">
            Try these popular pages:
          </p>
          <div className="grid gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg bg-[#f4f7f6] hover:bg-[#e8f0f0] transition-colors text-left group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                <Calculator className="w-5 h-5 text-[#0d7a7a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  Income Tax Calculator
                </p>
                <p className="text-xs text-gray-500">
                  Calculate your tax for 2025-2026
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg bg-[#f4f7f6] hover:bg-[#e8f0f0] transition-colors text-left group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                <Home className="w-5 h-5 text-[#0d7a7a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Homepage</p>
                <p className="text-xs text-gray-500">
                  Go back to the main page
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-lg bg-[#f4f7f6] hover:bg-[#e8f0f0] transition-colors text-left group"
            >
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                <FileSearch className="w-5 h-5 text-[#0d7a7a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  Tax Services
                </p>
                <p className="text-xs text-gray-500">
                  Expert tax consultation & filing
                </p>
              </div>
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d7a7a] hover:bg-[#0a6666] text-white font-bold rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
