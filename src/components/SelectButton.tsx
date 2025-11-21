// components/SelectButton.tsx
"use client";

interface SelectButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectButton({ label, selected, onClick }: SelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl p-4 w-full border flex items-center justify-center font-medium transition-all
        ${selected
          ? "border-primary bg-primary/10 text-primary shadow-sm scale-[1.02]"
          : "border-gray-300 text-gray-700 hover:border-primary/60 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );
}
