"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateQuote } from "@/lib/quote";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format } from "date-fns";

const schema = z.object({
  homeSqFt: z.string().min(1),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  cleaningType: z.enum(["standard", "deep"]),
  cleaningNeeds: z.enum(["one-time", "weekly", "bi-weekly", "monthly"]),
  isNewCustomer: z.boolean().default(false),
  preferredDate: z.date(),
  timeSlot: z.enum(["morning", "afternoon", "evening"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
});

type FormData = z.infer<typeof schema>;

export default function BookingPage() {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cleaningType: "standard",
      cleaningNeeds: "one-time",
      isNewCustomer: false,
    },
  });

  const homeSqFt = watch("homeSqFt");
  const bedrooms = watch("bedrooms");
  const bathrooms = watch("bathrooms");
  const cleaningType = watch("cleaningType");
  const cleaningNeeds = watch("cleaningNeeds");
  const isNewCustomer = watch("isNewCustomer");

  const estimatedPrice =
    homeSqFt && bedrooms >= 0 && bathrooms >= 0
      ? calculateQuote({
          homeSqFt,
          bedrooms,
          bathrooms,
          cleaningType,
          cleaningNeeds,
          isNewCustomer,
        })
      : null;

  const goNext = async () => {
    let fields: (keyof FormData)[] = [];

    if (step === 1) fields = ["homeSqFt", "bedrooms", "bathrooms"];
    if (step === 2) fields = ["cleaningType", "cleaningNeeds"];
    if (step === 3) fields = ["preferredDate", "timeSlot"];

    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
  };

  const onSubmit = async (data: FormData) => {
    await fetch("/api/submit-booking", {
      method: "POST",
      body: JSON.stringify({ ...data, estimatedPrice }),
      headers: { "Content-Type": "application/json" },
    });

    alert("Your request has been submitted!");
  };

  return (
    <div className="py-20 px-6 max-w-3xl mx-auto">
      {/* PROGRESS */}
      <div className="flex justify-center mb-10">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step >= n ? "bg-primary" : "bg-gray-300"
              }`}
            >
              {step > n ? <Check /> : n}
            </div>
            {n < 4 && (
              <div className={`w-12 h-1 mx-2 ${step > n ? "bg-primary" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">Tell us about your home</h2>

            {/* Home Sq Ft */}
            <div>
              <label className="block mb-2 font-semibold">Home Sq. Ft *</label>
              <select {...register("homeSqFt")} className="border p-3 rounded w-full">
                <option value="">Select size...</option>
                <option value="under_1000">Under 1000 sq ft</option>
                <option value="1001_1500">1001–1500 sq ft</option>
                <option value="1501_2000">1501–2000 sq ft</option>
                <option value="2001_2500">2001–2500 sq ft</option>
                <option value="2501_3000">2501–3000 sq ft</option>
                <option value="3001_3500">3001–3500 sq ft</option>
                <option value="3501_4000">3501–4000 sq ft</option>
                <option value="4001_plus">4001+ sq ft</option>
              </select>
            </div>

            {/* Bedroom & Bathroom Count */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">Bedrooms *</label>
                <input type="number" {...register("bedrooms")} className="border p-3 rounded w-full" />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Bathrooms *</label>
                <input type="number" {...register("bathrooms")} className="border p-3 rounded w-full" />
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              className="w-full bg-primary text-white py-4 rounded-lg text-lg flex items-center justify-center gap-2"
            >
              Continue <ChevronRight />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-6">Choose your cleaning type</h2>

            {/* Standard / Deep */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("cleaningType", "standard")}
                className={`p-6 border rounded-xl ${
                  cleaningType === "standard" ? "border-primary bg-primary/10" : ""
                }`}
              >
                Standard
              </button>

              <button
                type="button"
                onClick={() => setValue("cleaningType", "deep")}
                className={`p-6 border rounded-xl ${
                  cleaningType === "deep" ? "border-primary bg-primary/10" : ""
                }`}
              >
                Deep Clean
              </button>
            </div>

            {/* Frequency */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["one-time", "weekly", "bi-weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValue("cleaningNeeds", v as any)}
                  className={`p-4 border rounded-xl capitalize ${
                    cleaningNeeds === v ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  {v.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* New Customer Offer */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("isNewCustomer")}
                className="w-5 h-5"
              />
              <span className="font-semibold">Apply New Customer Discount</span>
            </label>

            {/* Price Preview */}
            {estimatedPrice && (
              <div className="p-6 bg-primary text-white rounded-xl text-center">
                <p className="text-sm opacity-90">Estimated Price</p>
                <div className="text-4xl font-bold">${estimatedPrice}</div>
              </div>
            )}

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-primary flex items-center gap-2">
                <ChevronLeft /> Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Continue <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — SCHEDULING */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Choose your date</h2>

            {/* Date */}
            <div>
              <label className="block mb-2 font-semibold">Preferred Date *</label>
              <input type="date" {...register("preferredDate", { valueAsDate: true })} className="border p-3 rounded w-full" />
            </div>

            {/* Time Slot */}
            <div className="grid grid-cols-3 gap-4">
              {["morning", "afternoon", "evening"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setValue("timeSlot", slot as any)}
                  className={`p-4 border rounded-xl capitalize ${
                    watch("timeSlot") === slot ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="text-primary flex items-center gap-2">
                <ChevronLeft /> Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Continue <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONTACT INFO */}
        {step === 4 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Your information</h2>

            <input placeholder="Full Name *" {...register("name")} className="border p-3 rounded w-full" />
            <input placeholder="Email Address *" {...register("email")} className="border p-3 rounded w-full" />
            <input placeholder="Phone Number *" {...register("phone")} className="border p-3 rounded w-full" />
            <input placeholder="Service Address *" {...register("address")} className="border p-3 rounded w-full" />

            {/* PRICE */}
            <div className="p-8 bg-primary text-white text-center rounded-xl">
              <p className="text-sm opacity-80">Your Estimated Price</p>
              <p className="text-4xl font-bold">${estimatedPrice}</p>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="text-primary flex items-center gap-2">
                <ChevronLeft /> Back
              </button>

              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg text-lg">
                Submit Request
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
