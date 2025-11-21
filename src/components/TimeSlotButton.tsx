// components/TimeSlotButton.tsx
"use client";

interface TimeSlotButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function TimeSlotButton({ label, selected, onClick }: TimeSlotButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border transition-all font-medium capitalize
        ${selected
          ? "border-primary bg-primary/10 text-primary shadow-sm scale-[1.02]"
          : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-primary/50"
        }
      `}
    >
      {label}
    </button>
  );
}
