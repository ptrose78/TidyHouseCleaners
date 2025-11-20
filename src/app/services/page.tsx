import PricingPreview from "@/components/pricing-preview";
import StandardCleaningCard from "@/components/service-cards/standard-cleaning-card";
import DeepCleaningCard from "@/components/service-cards/deep-cleaning-card";
import MoveOutCleaningCard from "@/components/service-cards/move-out-cleaning-card";
import DontCleanCard from "@/components/service-cards/dont-clean-card";

export default function ServicesPage() {
  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-20">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Cleaning Services</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Whether you need a quick refresh or a full deep clean, we have a service that fits your home.
        </p>
      </section>

      <PricingPreview />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StandardCleaningCard />
        <DeepCleaningCard />
        <MoveOutCleaningCard />
      </section>

      <section>
        <DontCleanCard />
      </section>
    </div>
  );
}
