'use client';

import * as React from 'react';
import { Quote } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';

const testimonials = [
  {
    name: 'Muhammad Bilal',
    designation: 'Co-Founder',
    content: 'Highly recommended! The tax calculator is accurate and their team is very professional.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Adeel Khan',
    designation: 'HR Manager',
    content: 'Saved me a lot of time and money. Excellent tax services and great customer support.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Sana Farooq',
    designation: 'Business Owner',
    content: 'Best platform for tax calculation and filing in Pakistan. Very reliable and trustworthy.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Ali Raza',
    designation: 'Accountant',
    content: 'Outstanding service! They made the entire tax filing process seamless and stress-free.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Fatima Ahmed',
    designation: 'Freelancer',
    content: 'As a freelancer, I was always confused about taxes. This team simplified everything for me.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Usman Choudhry',
    designation: 'Small Business Owner',
    content: 'Professional, efficient, and incredibly helpful. Highly recommended for all tax-related needs.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export default function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>(undefined);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 lg:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f2942] mb-3">
            What Our Customers Say
          </h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-amber-400 fill-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: 'center',
            loop: true,
            breakpoints: {
              '(min-width: 768px)': { align: 'start' },
            },
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full">
                  <div className="flex justify-between gap-4">
                    <div className="w-11 h-11 bg-[#e0f2f1] rounded-full flex items-center justify-center mb-5 shrink-0">
                      <Quote className="w-10 text-[#00796b] fill-[#00796b]" />
                    </div>
                    <p className="text-[#4a5568] text-[15px] leading-relaxed mb-6 font-normal">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 mt-auto">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-[#0f2942] text-[15px]">
                        {testimonial.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-2 border-white/20 bg-white/80 text-[#0f2942] hover:bg-white" />
          <CarouselNext className="hidden md:flex right-2 border-white/20 bg-white/80 text-[#0f2942] hover:bg-white" />
        </Carousel>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: testimonials.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? 'bg-[#00796b]' : 'bg-slate-200'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
