import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';

export function Terms() {
  useEffect(() => {
    document.title = 'Terms & Conditions | Apex Estates';
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
          <FileText className="w-4 h-4" />
          <span>Terms of Service</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Terms & Conditions</h1>
        <p className="text-slate-400 text-xs">Last updated: August 2026</p>
      </div>

      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Property Listings</h2>
          <p>
            All property specifications, prices, rates, and availability statuses shown on this website are subject to verification upon site visit. We reserve the right to update property availability without prior notice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Maximum Active Property Showcase</h2>
          <p>
            This website showcases a curated selection of up to 5 active properties at any given time. Inclusion of a property on the showcase does not constitute a binding legal agreement until formal sale agreements are executed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Intellectual Property</h2>
          <p>
            All logos, photographs, property descriptions, and branding elements displayed on this site belong to Apex Estates or its respective property owners.
          </p>
        </section>
      </div>
    </div>
  );
}
