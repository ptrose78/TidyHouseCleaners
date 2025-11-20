import PricingPreview from "@/components/pricing-preview";
import { CheckCircle, Star, Shield, Phone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="">

      {/* HERO SECTION */}
      <section className="pt-24 pb-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Professional House Cleaning in Milwaukee
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Trusted cleaning service for busy families, professionals,
            and homeowners who want a spotless home without the stress.
          </p>

          <a
            href="/booking"
            className="inline-block bg-primary text-white px-10 py-4 rounded-xl text-xl font-semibold hover:bg-primary/90 shadow-lg"
          >
            Book Your Cleaning →
          </a>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <HeroBadge
              icon={<Star className="w-8 h-8 text-primary" />}
              title="Hundreds of 5-Star Reviews"
            />
            <HeroBadge
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Fully Insured & Trusted"
            />
            <HeroBadge
              icon={<CheckCircle className="w-8 h-8 text-primary" />}
              title="100% Satisfaction Guarantee"
            />
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <PricingPreview />

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-8">Why Choose Tidy House Cleaners?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <WhyItem title="Trained Professionals" text="Our cleaners follow strict SOPs and quality standards." />
            <WhyItem title="Consistent Results" text="We clean your home exactly the same way every visit." />
            <WhyItem title="Locally Owned" text="Based in Oak Creek. Serving Milwaukee and nearby suburbs." />
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6">Serving Southeast Wisconsin</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
            Milwaukee • Oak Creek • Franklin • Greenfield • South Milwaukee • Cudahy • Greendale • Bay View
          </p>

          <a
            href="/booking"
            className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg hover:bg-primary/90"
          >
            Check Availability →
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready for a Clean Home?</h2>
        <a
          href="/booking"
          className="inline-block bg-primary text-white px-12 py-5 rounded-xl text-xl font-semibold hover:bg-primary/90 shadow-xl"
        >
          Book Your Cleaning Now →
        </a>
      </section>

    </div>
  );
}

function HeroBadge({ icon, title }: any) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <p className="text-lg font-semibold mt-3">{title}</p>
    </div>
  );
}

function WhyItem({ title, text }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
