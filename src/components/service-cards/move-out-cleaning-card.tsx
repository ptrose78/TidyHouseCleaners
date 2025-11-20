import { Truck } from "lucide-react";

export default function MoveOutCleaningCard() {
  return (
    <div className="p-8 rounded-xl border shadow-sm bg-white">
      <div className="flex items-center gap-3 mb-4">
        <Truck className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold">Move-In / Move-Out</h3>
      </div>

      <p className="text-gray-700 mb-6">
        Everything in Deep Cleaning PLUS all interior cleaning for empty homes.
      </p>

      <ul className="space-y-3 text-gray-700">
        <li>• Inside all cabinets & drawers</li>
        <li>• Inside refrigerator</li>
        <li>• Inside oven</li>
        <li>• Window tracks</li>
        <li>• Full home reset for moving</li>
      </ul>
    </div>
  );
}
