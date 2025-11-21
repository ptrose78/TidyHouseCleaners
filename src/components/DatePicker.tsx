// components/DatePicker.tsx
"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            w-full flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3
            hover:bg-gray-50 transition text-left
          "
        >
          <span>{date ? format(date, "PPP") : "Select a date"}</span>
          <CalendarIcon className="w-5 h-5 opacity-70" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="z-[9999] bg-white shadow-xl p-0 rounded-xl">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onSelect(selectedDate);  // ← send only valid date
              setOpen(false);         // ← close popover
            }
          }}
          disabled={(d) =>
            d < new Date(new Date().setHours(0, 0, 0, 0))
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
