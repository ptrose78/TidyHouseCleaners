import { Sparkles } from "lucide-react";

export default function StandardCleaningCard() {
  return (
    <div className="p-8 rounded-xl border shadow-sm bg-white">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold">Standard Cleaning</h3>
      </div>

      <p className="text-gray-700 mb-6">
        Best for regular upkeep and homes that are already fairly well maintained.
      </p>

      <ul className="space-y-3 text-gray-700">
        <li>• Kitchen counters & surfaces</li>
        <li>• Exterior of appliances</li>
        <li>• Bathroom counters, sinks, toilets, mirrors</li>
        <li>• Light surface dusting</li>
        <li>• Vacuum all floors</li>
        <li>• Mop hard floors</li>
        <li>• Tidying bedrooms and common areas</li>
      </ul>
    </div>
  );
}
