"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaxCTA() {
  return (
    <section className="">
      <div className="py-8 md:py-12 bg-[url('/HonePage/ValuePropositions.webp')] bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
          {/* Background Decorative Logo (Subtle 'NB' watermark) */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none flex items-center justify-center select-none">
            <span className="text-[20rem] font-bold text-white leading-none">
              B
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Side: Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                We Simplify Tax for You
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl">
                We are a tax preparation company in Pakistan that specializes in
                offering financial services, firm registration, tax planning and
                filing for businesses and individuals. We help you with tax
                compliance, ensuring accurate filings and planning to minimize
                tax liabilities.
              </p>

              {/* Email Contact Box */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-white overflow-hidden bg-white/10 rounded-full">
                  <Mail className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-xs md:text-sm">
                  <p className="text-gray-400 font-medium">Need Help? Email:</p>
                  <p className="text-white font-semibold">
                    contact@navigatebusinesses.com
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  variant="outline"
                  size="2xl"
                  className="rounded-full px-8 border-white/20 bg-transparent text-white hover:bg-white hover:text-[#0a3d3d] transition-all"
                >
                  Tax Services
                </Button>
                <Button
                  size="2xl"
                  className="rounded-full px-8 bg-[#0d7a7a] hover:bg-[#119191] text-white border-none shadow-lg"
                >
                  File Your Tax Return
                </Button>
              </div>
            </div>

            {/* Right Side: Embedded YouTube Video */}
            <div className="rounded-2xl overflow-hidden border-[6px] border-white/10 shadow-2xl relative aspect-video">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Kua5KQ2o5H4?si=4IU3U-7zg4Vh8w6q"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
