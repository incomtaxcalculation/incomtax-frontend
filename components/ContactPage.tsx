"use client";

import { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const subjectOptions = [
    "Company / Firm Registration",
    "Income Tax Return Filing",
    "Tax Appeals & Litigation",
    "Drafting Legal Agreements & Contracts",
    "Other",
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicHeader />
      <main>
        <section className="bg-gradient-to-br from-[#0a3d3d] to-[#0d7a7a] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Contact Us
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Get in touch with our team for expert tax and finance guidance
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#f4f7f6]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3d] mb-8">
                  Send Us a Message
                </h2>

                {success ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#0a3d3d] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Thank you for reaching out. We will get back to you
                      shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2.5 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors text-sm font-medium"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-8 shadow-sm space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/20 focus:border-[#0d7a7a] text-sm"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/20 focus:border-[#0d7a7a] text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/20 focus:border-[#0d7a7a] text-sm"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subject
                      </label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/20 focus:border-[#0d7a7a] text-sm bg-white"
                      >
                        <option value="" disabled>
                          Select a subject
                        </option>
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d7a7a]/20 focus:border-[#0d7a7a] text-sm resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3d] mb-8">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0d7a7a]/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#0d7a7a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a3d3d] mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:contact@navigatebusinesses.com"
                        className="text-gray-500 text-sm hover:text-[#0d7a7a] transition-colors"
                      >
                        contact@navigatebusinesses.com
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0d7a7a]/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#0d7a7a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a3d3d] mb-1">
                        Phone
                      </h3>
                      <a
                        href="tel:+923137937530"
                        className="text-gray-500 text-sm hover:text-[#0d7a7a] transition-colors"
                      >
                        +92 313 7937530
                      </a>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0d7a7a]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#0d7a7a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0a3d3d] mb-1">
                        Location
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Lahore, Pakistan
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-[#0a3d3d] mb-3">
                    Office Hours
                  </h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Monday – Friday</span>
                      <span>9:00 AM – 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM – 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
