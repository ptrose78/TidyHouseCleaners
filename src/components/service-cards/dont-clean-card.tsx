import { ShieldAlert } from "lucide-react";

export default function DontCleanCard() {
  return (
    <div className="p-8 rounded-xl border shadow-sm bg-white">
      <div className="flex items-center gap-3 mb-4">
        <ShieldAlert className="w-6 h-6 text-red-500" />
        <h3 className="text-2xl font-semibold">What We Don’t Clean</h3>
      </div>

      <p className="text-gray-700 mb-6">
        For safety, insurance, and legal reasons, we cannot perform:
      </p>

      <ul className="space-y-3 text-gray-700">
        <li>• Mold removal (requires licensed remediation)</li>
        <li>• Human or animal waste / biohazards</li>
        <li>• High exterior windows</li>
        <li>• Carpet shampooing / steam cleaning</li>
        <li>• Lifting heavy furniture or appliances</li>
        <li>• Pest infestations</li>
        <li>• Black soot / smoke damage</li>
      </ul>

      <p className="mt-4 text-gray-600 text-sm">
        We follow Wisconsin DFI and OSHA regulations for safe cleaning practices.
      </p>
    </div>
  );
}
