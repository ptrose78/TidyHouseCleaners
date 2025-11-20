import { Sparkles } from "lucide-react";

export default function DeepCleaningCard() {
  return (
    <div className="p-8 rounded-xl border shadow-sm bg-white">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold">Deep Cleaning</h3>
      </div>

      <p className="text-gray-700 mb-6">
        Includes everything in Standard Cleaning PLUS detailed scrubbing & buildup removal.
      </p>

      <ul className="space-y-3 text-gray-700">
        <li>• Baseboards</li>
        <li>• Trim, door frames, switch plates</li>
        <li>• Scrub shower tile & grout</li>
        <li>• Inside microwave & small appliances</li>
        <li>• Heavy dust removal</li>
        <li>• Buildup on sinks, faucets, stove</li>
      </ul>
    </div>
  );
}
