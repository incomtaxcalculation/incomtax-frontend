"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subjects = [
  "Tax Consultation",
  "Business Registration",
  "Audit Services",
  "Income Tax Filing",
  "Sales Tax Registration",
  "Other",
];

export default function ConsultationCTA() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="relative w-full bg-gradient-to-r from-[#f0f9f9] to-[#e6f2f2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left/Center Content - Form & Text */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="space-y-2 text-center w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3d]">
                Ready to Talk to Our Experts?
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Get a free consultation for your tax and business needs.
              </p>
            </div>

            {/* Horizontal Form Layout */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl lg:max-w-none">
              <div className="w-full sm:w-[320px]">
                <Select
                  onValueChange={(value) => setSelectedSubject(value)}
                  defaultValue={selectedSubject}
                >
                  <SelectTrigger aria-label="Select your subject" className="w-full h-12! bg-white border-gray-200 text-gray-500 rounded-md shadow-sm focus:ring-[#0d7a7a]/20">
                    <SelectValue placeholder="Select your subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-xl rounded-md">
                    <SelectGroup>
                      <SelectLabel>Subjects</SelectLabel>
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject}
                          value={subject}
                          className="h-12! text-gray-700 focus:bg-[#f0f7f7] focus:text-[#0d7a7a] cursor-pointer"
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="2xl"
                className="w-full sm:w-auto h-12 px-10 bg-[#0d7a7a] hover:bg-[#0a6666] text-white font-bold rounded-md shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                Free Consultation
              </Button>
            </div>
          </div>

          {/* Right Image - Experts */}
          <div className="flex-1 relative w-full max-w-[500px] lg:max-w-none h-28 md:h-40 lg:h-48">
            <Image
              src="/HonePage/Consultation.webp"
              alt="Consultation with Tax Experts"
              fill
              className="object-contain object-bottom-right"
              priority
            />
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border/Divider similar to the screenshot */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#0a3d3d]/10"></div>
    </section>
  );
}
