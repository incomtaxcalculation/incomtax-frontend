"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import { Shield, Users, Award, TrendingUp } from "lucide-react";

const stats = [
  { label: "Years of Experience", value: "10+" },
  { label: "Clients Served", value: "500+" },
  { label: "Tax Returns Filed", value: "2000+" },
  { label: "Team Members", value: "15+" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Integrity",
    description:
      "We uphold the highest standards of honesty and transparency in every client engagement.",
  },
  {
    icon: Users,
    title: "Client-Centric Approach",
    description:
      "Your success is our priority. We tailor our solutions to meet your unique business needs.",
  },
  {
    icon: Award,
    title: "Expertise & Excellence",
    description:
      "Our team brings deep industry knowledge and continuous professional development to every project.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused",
    description:
      "We don't just manage compliance — we help your business grow with strategic financial guidance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="bg-gradient-to-br from-[#0a3d3d] to-[#0d7a7a] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                About Us
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Your trusted partner in tax, finance, and compliance across
                Pakistan
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3d] mb-6">
                  Who We Are
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Navigate Business is a premier tax, finance, and compliance
                    consultancy firm based in Pakistan. We are dedicated to
                    providing businesses and individuals with expert guidance
                    across income tax, sales tax, company registration,
                    trademark, bookkeeping, audit, and litigation services.
                  </p>
                  <p>
                    Our team of seasoned professionals brings decades of
                    combined experience in Pakistani tax law, corporate
                    finance, and regulatory compliance. We understand the
                    complexities of the FBR system and help our clients
                    navigate it with confidence.
                  </p>
                  <p>
                    From startups to established enterprises, we tailor our
                    services to meet the unique challenges of each client,
                    ensuring compliance while optimizing financial outcomes.
                  </p>
                </div>
              </div>
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d7a7a]/10 to-[#0a3d3d]/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#0d7a7a]/10 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-[#0d7a7a]" />
                  </div>
                  <p className="text-[#0a3d3d] font-semibold text-lg">
                    Your Success, Our Mission
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Building a better financial future for Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#f4f7f6]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3d] mb-3">
                Our Core Values
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#0d7a7a]/10 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-[#0d7a7a]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a3d3d] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-[#0d7a7a] mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
