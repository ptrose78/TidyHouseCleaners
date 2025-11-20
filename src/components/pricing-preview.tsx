import { Home, Sparkles, Truck } from "lucide-react";

export default function PricingPreview() {
  const items = [
    {
      title: "Standard Cleaning",
      price: "$110–$220",
      icon: <Home className="w-6 h-6 text-primary" />,
      description: "Perfect for regular maintenance and general upkeep.",
    },
    {
      title: "Deep Cleaning",
      price: "$190–$400",
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      description: "Ideal for first-time cleans or homes needing detailed work.",
    },
    {
      title: "Move-In / Move-Out",
      price: "$240–$500",
      icon: <Truck className="w-6 h-6 text-primary" />,
      description: "Best for empty homes before moving in or after moving out.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold mb-6">
          Pricing at a Glance
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Transparent, honest, and upfront pricing for every home.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-2xl border shadow-sm hover:shadow-lg transition bg-white"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-3xl font-bold text-primary mb-3">{item.price}</p>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="/booking"
            className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90"
          >
            Get Your Exact Quote →
          </a>
        </div>
      </div>
    </section>
  );
}
