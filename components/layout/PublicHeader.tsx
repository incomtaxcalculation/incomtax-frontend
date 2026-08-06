"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import ServicesDropdown from "./ServicesDropdown";

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Videos", href: "/videos" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto py-4 px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logos/trimmed.webp"
              alt="Navigate Business"
              width={80}
              height={59}
              className="w-10 md:w-14 lg:w-20 object-contain"
            />
            <div>
              <span className="text-lg md:text-xl font-bold text-foreground">
                Navigate Business
              </span>
              <p className="text-xs text-muted-foreground">
                Tax | Finance | Compliance
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.name === "Services" ? (
                <ServicesDropdown key={link.name} />
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          <div className="hidden md:block">
            <Link href="/contact">
              <Button size="3xl" className="px-4">
                Book an appointment
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Link
                  href="/admin/login"
                  className="text-foreground hover:text-primary font-medium transition-colors py-2 rounded-lg text-center hover:bg-gray-100 border border-gray-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors"
                >
                  Register
                </Link>
                <div className="md:hidden">
                  <Link href="/contact">
                  <Button size="3xl" className="px-4 w-full">
                      Book an appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
