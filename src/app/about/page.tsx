"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            We Don't Just Wipe Surfaces. <br />
            <span className="text-primary">We Restore Them.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Many cleaning services operate on a surface level. We believe true clean goes deeper. 
            We founded Tidy House Cleaners to bridge the gap between "looking clean" and "being clean."
          </p>
        </div>
      </section>

      {/* 2. THE VISUAL PROOF (The Tub Case Study) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">The Tidy House Difference</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We recently visited a home that had been cleaned by a competitor. 
            The bathtub looked "okay" at a glance, but we knew better. 
            Here is the difference between a wipe-down and a Tidy House scrub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Before */}
          <div className="group">
            <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-5 border border-gray-200 shadow-sm">
              <Image 
                src="/before-tub-copy.jpg" 
                alt="Bathtub before cleaning" 
                fill 
                className="object-cover group-hover:scale-500 transition-transform duration-1500" // Changed scale to 150
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm pointer-events-none"> {/* Added pointer-events-none */}
                Before
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">The Starting Point</h3>
            <p className="text-gray-500 leading-relaxed">
              Standard buildup from daily use. Soap scum, hard water minerals, and oils trapped in the texture.
            </p>
          </div>

          {/* Card 2: Competition */}
          <div className="group relative">
            {/* Arrow on Desktop */}
            <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-300 pointer-events-none"> {/* Added pointer-events-none */}
              <ArrowRight size={32} />
            </div>

            <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-5 border-2 border-red-100 shadow-sm">
               <div className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide z-10 pointer-events-none"> {/* Added pointer-events-none */}
                 The Competition
               </div>
              <Image 
                src="/competition-copy02.jpg" 
                alt="Bathtub cleaned by competition" 
                fill 
                className="object-cover group-hover:scale-500 transition-transform duration-1500" // Changed scale to 150
              />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">The "Surface Clean"</h3>
            <p className="text-gray-500 leading-relaxed">
              This is where most cleaners stop. It looks white from the doorway, but look closely at the bottom—the grime is still trapped in the texture.
            </p>
          </div>

          {/* Card 3: Yours */}
          <div className="group">
            <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-5 border-2 border-primary shadow-2xl shadow-primary/10">
               <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide z-10 flex items-center gap-1 pointer-events-none"> {/* Added pointer-events-none */}
                 <Sparkles size={12} /> Tidy House Result
               </div>
              <Image 
                src="/after-tub.jpeg" 
                alt="Bathtub cleaned by Tidy House" 
                fill 
                className="object-cover group-hover:scale-500 transition-transform duration-1500" // Changed scale to 150
              />
            </div>
            <h3 className="font-bold text-xl text-primary mb-2">The Restoration</h3>
            <p className="text-gray-500 leading-relaxed">
              We used the right chemistry and elbow grease to lift the buildup from the pores of the surface. Not just clean—restored.
            </p>
          </div>

        </div>
      </section>

      {/* 3. VALUES / WHY US */}
      <section className="bg-gray-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Standards so high, <br />
                <span className="text-primary">we scare the dirt away.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                We know that inviting someone into your home requires trust. 
                We honor that trust by treating your home with the same level of care we treat our own. 
                We don't rush, we don't cut corners, and we don't call it "done" until it meets our strict standards.
              </p>
              
              <div className="space-y-4">
                {[
                  "No Hidden Fees or Surprise Charges",
                  "Background Checked & Insured Professionals",
                  "100% Satisfaction Guarantee",
                  "We Bring All Our Own Supplies"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-primary/20 p-1 rounded-full text-primary">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Box */}
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700">
              <ShieldCheck className="text-primary w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Peace of Mind, Delivered.</h3>
              <p className="text-gray-400 mb-8">
                Stop worrying about whether the cleaners did a good job. 
                With Tidy House, you walk into a home that smells fresh, feels lighter, and is truly sanitary.
              </p>
              <Link 
                href="/booking" 
                className="block w-full bg-white text-gray-900 text-center font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Get Your Quote in 60 Seconds
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">Ready for the Tidy House Standard?</h2>
          <p className="text-xl text-gray-500">
            See the difference for yourself. Book your first clean today and let us restore your home's sparkle.
          </p>
          <Link 
            href="/booking" 
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-full text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:bg-primary/90 transition-all transform hover:-translate-y-1"
          >
            Book Now <ArrowRight />
          </Link>
        </div>
      </section>

    </main>
  );
}