import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Apex Estates';
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Compliance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-slate-400 text-xs">Last updated: August 2026</p>
      </div>

      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information Collection</h2>
          <p>
            When you submit an enquiry form on our website, we collect your name, phone number, email address, and specific property interest to respond to your request.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Use of Information</h2>
          <p>
            Your information is used solely for sales assistance, site visit coordination, and customer communication regarding real estate offerings. We do not sell or rent your contact details to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Data Security</h2>
          <p>
            We enforce industry-standard security protocols via Supabase PostgreSQL authentication and Row Level Security (RLS) to ensure customer enquiries remain secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our legal representative at legal@apexestates.com.
          </p>
        </section>
      </div>
    </div>
  );
}
