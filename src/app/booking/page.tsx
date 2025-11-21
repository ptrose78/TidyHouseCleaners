"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateQuote } from "@/lib/quote";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";
import { TimeSlotButton } from "@/components/TimeSlotButton";

// ----------------------------
// ZOD SCHEMA
// ----------------------------
const schema = z.object({
  homeSqFt: z.string().min(1, "Please select a size"),
  bedrooms: z.coerce.number().min(0, "Required"),
  bathrooms: z.coerce.number().min(0, "Required"),
  cleaningType: z.enum(["standard", "deep"]),
  cleaningNeeds: z.enum(["one-time", "weekly", "bi-weekly", "monthly"]),
  isNewCustomer: z.boolean().default(false),
  preferredDate: z.date()
    .nullable()
    .optional()
    .refine((date) => !!date, { message: "Please select a date" }),

  timeSlot: z.enum(["morning", "afternoon", "evening"])
    .nullable()
    .optional()
    .refine((val) => !!val, { message: "Please select a time slot" }),
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Required"),
});

type FormData = z.infer<typeof schema>;

// ----------------------------
// COMPONENT
// ----------------------------
export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, submitCount },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      homeSqFt: "",
      bedrooms: 0,
      bathrooms: 0,
      cleaningType: "standard",
      cleaningNeeds: "one-time",
      isNewCustomer: false,
      preferredDate: undefined,
      timeSlot: undefined,
    },
  });

  const homeSqFt = watch("homeSqFt");
  const bedrooms = watch("bedrooms");
  const bathrooms = watch("bathrooms");
  const cleaningType = watch("cleaningType");
  const cleaningNeeds = watch("cleaningNeeds");
  const preferredDate = watch("preferredDate");
  const timeSlot = watch("timeSlot");
  const isNewCustomer = watch("isNewCustomer");

  // ----------------------------
  // PRICE CALCULATION
  // ----------------------------
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

  // ----------------------------
  // STEP VALIDATION
  // ----------------------------
  const fieldsByStep: Record<number, (keyof FormData)[]> = {
    1: ["homeSqFt", "bedrooms", "bathrooms"],
    2: ["cleaningType", "cleaningNeeds"],
    3: ["preferredDate", "timeSlot"],
  };

 const goNext = async () => {
  let fields: (keyof FormData)[] = [];

  if (step === 1) fields = ["homeSqFt", "bedrooms", "bathrooms"];
  if (step === 2) fields = ["cleaningType", "cleaningNeeds"];
  if (step === 3) fields = ["preferredDate", "timeSlot"];

  // mark as touched
  fields.forEach((f) => setTouched((prev) => ({ ...prev, [f]: true })));

  await new Promise((res) => setTimeout(res, 10));

  const valid = await trigger(fields);
  if (valid) setStep(step + 1);
};

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const onSubmit = async (data: FormData) => {
    await fetch("/api/submit-booking", {
      method: "POST",
      body: JSON.stringify({ ...data, estimatedPrice }),
      headers: { "Content-Type": "application/json" },
    });

    alert("Your request has been submitted!");

    reset();
    setStep(1);
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="py-20 px-6 max-w-3xl mx-auto">
      {/* PROGRESS INDICATOR */}
      <div className="flex justify-center items-center mb-10">
        {[1, 2, 3, 4].map((n) => {
          const isCompleted = step > n;
          const isActive = step === n;

          return (
            <div key={n} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${isCompleted || isActive ? "bg-primary text-white" : "bg-gray-300"}
                `}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : n}
              </div>

              {n < 4 && (
                <div
                  className={`
                    w-14 h-1 mx-2
                    ${step > n ? "bg-primary" : "bg-gray-300"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* -----------------------------
            STEP 1 — HOME DETAILS
        */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-6">
              Tell us about your home
            </h2>

            {/* HOME SQ FT */}
            <div>
              <label className="block mb-2 font-semibold">Home Sq. Ft *</label>
              <select
                {...register("homeSqFt")}
                onChange={(e) => {
                  setValue("homeSqFt", e.target.value);
                  trigger("homeSqFt");
                }}
                className={`
                  border p-3 rounded w-full
                  ${errors.homeSqFt ? "border-red-500 bg-red-50" : "border-gray-300"}
                `}
              >
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

              {errors.homeSqFt && (
                <p className="text-red-600 text-sm">{errors.homeSqFt.message}</p>
              )}
            </div>

            {/* BEDROOM + BATHROOM */}
            <div className="grid grid-cols-2 gap-6">
              {/* BEDROOMS */}
              <div>
                <label className="block mb-2 font-semibold">Bedrooms *</label>
                <input
                  type="number"
                  {...register("bedrooms")}
                  onChange={(e) => {
                    setValue("bedrooms", Number(e.target.value));
                    trigger("bedrooms");
                  }}
                  className={`
                    border p-3 rounded w-full
                    ${errors.bedrooms ? "border-red-500 bg-red-50" : "border-gray-300"}
                  `}
                />
                {errors.bedrooms && (
                  <p className="text-red-600 text-sm">{errors.bedrooms.message}</p>
                )}
              </div>

              {/* BATHROOMS */}
              <div>
                <label className="block mb-2 font-semibold">Bathrooms *</label>
                <input
                  type="number"
                  {...register("bathrooms")}
                  onChange={(e) => {
                    setValue("bathrooms", Number(e.target.value));
                    trigger("bathrooms");
                  }}
                  className={`
                    border p-3 rounded w-full
                    ${errors.bathrooms ? "border-red-500 bg-red-50" : "border-gray-300"}
                  `}
                />
                {errors.bathrooms && (
                  <p className="text-red-600 text-sm">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>

            {/* CONTINUE BUTTON */}
            <button
              type="button"
              onClick={goNext}
              className="w-full bg-primary py-4 text-white rounded-lg text-lg flex items-center justify-center gap-2"
            >
              Continue <ChevronRight />
            </button>
          </div>
        )}

        {/* -----------------------------
            STEP 2 — CLEANING TYPE
        ------------------------------ */}
        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Choose your cleaning type</h2>

            {/* Standard / Deep */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Standard", value: "standard" },
                { label: "Deep Clean", value: "deep" },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("cleaningType", value as any)}
                  className={`
                    p-6 border rounded-xl
                    ${
                      watch("cleaningType") === value
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Frequency */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["one-time", "weekly", "bi-weekly", "monthly"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setValue("cleaningNeeds", v as any)}
                  className={`
                    p-4 border rounded-xl capitalize
                    ${
                      watch("cleaningNeeds") === v
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                    }
                  `}
                >
                  {v.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* PRICE PREVIEW */}
            {estimatedPrice && (
              <div className="p-6 bg-primary text-white rounded-xl text-center">
                <p className="text-sm opacity-90">Estimated Price</p>
                <div className="text-4xl font-bold">${estimatedPrice}</div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-primary flex items-center gap-2"
              >
                <ChevronLeft /> Back
              </button>

              <button
                type="button"
                onClick={goNext}
                className="bg-primary px-6 py-3 rounded-lg flex items-center gap-2 text-white"
              >
                Continue <ChevronRight />
              </button>
            </div>
          </div>
        )}

       {/* -----------------------------
            STEP 3 — SCHEDULING (Updated)
        ------------------------------ */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Choose your date</h2>

            {/* DATE */}
            <div>
              <label className="block mb-2 font-semibold">Preferred Date *</label>
              <DatePicker
                date={preferredDate}
                onSelect={(d) => {
                  // Added { shouldValidate: true } to clear error immediately on selection
                  setValue("preferredDate", d as Date, { shouldValidate: true });
                }}
              />
              {errors.preferredDate && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>

            {/* TIME SLOT */}
            <div>
              <label className="block mb-2 font-semibold">Time of Day *</label>
              <div className="grid grid-cols-3 gap-4">
                {["morning", "afternoon", "evening"].map((slot) => (
                  <TimeSlotButton
                    key={slot}
                    label={slot}
                    selected={timeSlot === slot}
                    onClick={() => {
                      // Added { shouldValidate: true } to clear error immediately on selection
                      setValue("timeSlot", slot as any, { shouldValidate: true });
                    }}
                  />
                ))}
              </div>
              {errors.timeSlot && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.timeSlot.message}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-primary flex items-center gap-2"
              >
                <ChevronLeft /> Back
              </button>

              <button
                type="button"
                onClick={goNext}
                className="bg-primary px-6 py-3 rounded-lg flex items-center gap-2 text-white"
              >
                Continue <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* -----------------------------
            STEP 4 — CONTACT INFO
        ------------------------------ */}
        {step === 4 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Your information</h2>

            {/* NAME */}
            <input
              placeholder="Full Name *"
              {...register("name")}
              className={`
                border p-3 rounded w-full
                ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}
              `}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}

            {/* EMAIL */}
            <input
              placeholder="Email Address *"
              {...register("email")}
              className={`
                border p-3 rounded w-full
                ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}
              `}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}

            {/* PHONE */}
            <input
              placeholder="Phone Number *"
              {...register("phone")}
              className={`
                border p-3 rounded w-full
                ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}
              `}
            />
            {errors.phone && (
              <p className="text-red-600 text-sm">{errors.phone.message}</p>
            )}

            {/* ADDRESS */}
            <input
              placeholder="Service Address *"
              {...register("address")}
              className={`
                border p-3 rounded w-full
                ${errors.address ? "border-red-500 bg-red-50" : "border-gray-300"}
              `}
            />
            {errors.address && (
              <p className="text-red-600 text-sm">{errors.address.message}</p>
            )}

            {/* PRICE FINAL */}
            <div className="p-8 bg-primary text-white text-center rounded-xl">
              <p className="text-sm opacity-80">Your Estimated Price</p>
              <p className="text-4xl font-bold">${estimatedPrice}</p>
            </div>

            {/* Submit */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-primary flex items-center gap-2"
              >
                <ChevronLeft /> Back
              </button>

              <button
                type="submit"
                className="bg-primary px-6 py-3 rounded-lg text-white text-lg"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
