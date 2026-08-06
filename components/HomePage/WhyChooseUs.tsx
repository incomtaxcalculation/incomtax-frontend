'use client';

import { 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Briefcase, 
  Building 
} from 'lucide-react';

const reasons = [
  {
    icon: TrendingUp,
    title: 'Increase',
    subTitle: 'Tax Credits',
  },
  {
    icon: Wallet,
    title: 'Reduce Cash',
    subTitle: 'Spend on Taxes',
  },
  {
    icon: ShieldCheck,
    title: 'Sustain',
    subTitle: 'Peace of Mind',
  },
  {
    icon: Briefcase,
    title: 'Business',
    subTitle: 'Legal Activity',
  },
  {
    icon: Building,
    title: 'Corporation Tax',
    subTitle: 'Consultant',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0a3d3d] mb-1">
            Why Choose Us
          </h2>
          <p className="text-[13px] text-gray-500">
            We deal with all aspects of the tax consulting service
          </p>
        </div>

        {/* Horizontal Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="h-full bg-white rounded-xl p-5 border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-300 flex items-center gap-4 flex-col md:flex-row text-center"
              >
                {/* Icon Container */}
                <div className="bg-[#f0f7f7] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#0d7a7a]" strokeWidth={2} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <p className="text-[12px] text-gray-500 font-medium leading-none mb-1">
                    {reason.title}
                  </p>
                  <p className="text-[13px] font-bold text-[#0a3d3d] leading-tight">
                    {reason.subTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}