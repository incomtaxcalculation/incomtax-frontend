import Link from "next/link";
import { FileText, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCtaBannerProps {
  title?: string;
  highlight?: string;
  highlightColor?: string;
  description?: string;
  applyButtonText?: string;
  callButtonText?: string;
  whatsappButtonText?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
}

export default function ServiceCtaBanner({
  title = "Ready to Register Your",
  highlight = "Income Tax?",
  highlightColor = "#3db8a8",
  description = "Don\u2019t delay your NTN registration. Get professional assistance today.",
  applyButtonText = "Apply Now",
  callButtonText = "Call Now (+92 313 7937530)",
  whatsappButtonText = "WhatsApp Us",
  phoneNumber = "+923137937530",
  whatsappNumber = "923137937530",
}: ServiceCtaBannerProps) {
  return (
    <section className="bg-[#002233] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="text-center lg:text-left max-w-xl">
            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold text-white leading-tight mb-3">
              {title}{" "}
              <span style={{ color: highlightColor }}>{highlight}</span>
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-end gap-3">
            <Button
              size="xl"
              className="h-11 px-5 bg-[#006666] hover:bg-[#005555] text-white border-0 font-semibold w-full sm:w-auto"
              asChild
            >
              <Link href="/apply">
                <FileText className="w-4 h-4" />
                {applyButtonText}
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="h-11 px-5 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              asChild
            >
              <a href={`tel:${phoneNumber}`}>
                <Phone className="w-4 h-4" />
                {callButtonText}
              </a>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="h-11 px-5 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              asChild
            >
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                {whatsappButtonText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
