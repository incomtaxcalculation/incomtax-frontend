"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaLinkedin, FaYoutube, FaShareAlt } from "react-icons/fa";
import { Share2, Mail, Phone } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAppContext } from "@/context/AppContext";

const usefulLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Video", href: "/videos" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Footer() {
  const { apiUrl } = useAppContext();
  const [email, setEmail] = useState("");
  const [services, setServices] = useState<{ title: string; slug: string }[]>([]);

  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    const seen = new Set<string>();

    fetch(`${apiUrl}/api/services?limit=6&status=active`)
      .then((res) => res.json())
      .then((data) => {
        if (data.services) {
          for (const s of data.services) {
            seen.add(s.slug);
          }
          setServices(data.services);
        }
      })
      .catch(() => {});

    fetch("/data/services-static.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.services) {
          setServices((prev) => {
            const merged = [...prev];
            for (const s of data.services) {
              if (!seen.has(s.slug)) {
                seen.add(s.slug);
                merged.push({ title: s.title, slug: s.slug });
              }
            }
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    setSubscribeLoading(true);
    e.preventDefault();
    // Handle newsletter subscription logic here
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      console.log(response);
      if (response.ok) {
        toast.success("Subscribed successfully!");
        setSubscribeLoading(false);
      } else {
        const data = await response.json();
        toast.error(data.msg || "Subscription failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubscribeLoading(false);
    }
    setEmail("");
  };

  return (
    <footer className="bg-[#002133] text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter Column */}
          <div className="space-y-8">
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/Logos/trimmed.webp"
                  alt="Navigate Business"
                  width={70}
                  height={52}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Navigate Business
                </h3>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                  Tax | Finance | Compliance
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">
                Sign Up For Our Newsletter
              </h4>
              <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 h-12 px-4 bg-white text-gray-900 rounded-md py-2.5 text-sm focus:outline-none"
                />
                <Button
                  type="submit"
                  size="2xl"
                  className="w-full"
                  disabled={subscribeLoading}
                >
                  {subscribeLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>

          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-base font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[13px] text-gray-300 hover:text-[#0d7a7a] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d7a7a]" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links Column */}
          <div>
            <h4 className="text-base font-bold mb-6">Useful Links</h4>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-300 hover:text-[#0d7a7a] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d7a7a]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-base font-bold mb-6">Contact Us</h4>
            <div className="space-y-5">
              <a
                href="mailto:contact@navigatebusinesses.com"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#0d7a7a] transition-colors">
                  <Mail
                    size={16}
                    className="text-gray-400 group-hover:text-[#0d7a7a]"
                  />
                </div>
                <span className="text-[13px] text-gray-300 break-all">
                  contact@navigatebusinesses.com
                </span>
              </a>
              <a
                href="tel:+923137937530"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#0d7a7a] transition-colors">
                  <Phone
                    size={16}
                    className="text-gray-400 group-hover:text-[#0d7a7a]"
                  />
                </div>
                <span className="text-[13px] text-gray-300">
                  +92 313 7937530
                </span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-4">
              {[
                { icon: FaFacebook, href: "#", label: "Facebook" },
                { icon: FaLinkedin, href: "#", label: "LinkedIn" },
                { icon: FaYoutube, href: "#", label: "YouTube" },
                { icon: Share2, href: "#", label: "Share" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <social.icon size={16} className="text-white" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-[12px] text-gray-400">
            © Tax Calculator Pakistan. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
