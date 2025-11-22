"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// -------------------
// VALIDATION SCHEMA
// -------------------
const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 10, {
      message: "Phone number must be at least 10 digits",
    }),
  message: z.string().min(5, "Message cannot be empty"),
  turnstileToken: z.string().min(1, "Captcha failed"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // -------------------
  // LOAD TURNSTILE
  // -------------------
  useEffect(() => {
    const interval = setInterval(() => {
     if ((window as any).turnstile) {
          (window as any).turnstile.render("#turnstile-container", {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
            callback: (token: string) => {
            setValue("turnstileToken", token);
            setCaptchaReady(true);
          },

          // ⭐ INVISIBLE CAPTCHA
          size: "invisible",
          execution: "async",
          appearance: "execute",


          "error-callback": () => {
            console.warn("Turnstile error — retrying…");
            setCaptchaReady(false);
          },

          "expired-callback": () => {
            console.log("Turnstile expired — resetting…");
            setCaptchaReady(false);
            try {
             (window as any).turnstile.reset("#turnstile-container");
            } catch {}
          },
        });

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [setValue]);

  // -------------------
  // SUBMIT HANDLER
  // -------------------
  const onSubmit = async (data: FormData) => {
    const response = await fetch("/api/send-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setSubmitted(true);
      reset();
      setCaptchaReady(false);
    }
  };

  // -------------------
  // UI
  // -------------------
  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-10">
        Have a question? We’re here to help.
      </p>

      {/* SUCCESS MESSAGE */}
      {submitted ? (
        <div className="p-6 bg-green-100 border border-green-400 rounded-lg text-green-800 text-lg">
          ✅ Thank you! Your message has been sent. We'll reach out within 24 hours.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* NAME */}
          <div>
            <label className="block mb-2 font-semibold">Full Name *</label>
            <input
              type="text"
              {...register("name")}
              className={`border p-3 rounded w-full ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-semibold">Email *</label>
            <input
              type="email"
              {...register("email")}
              className={`border p-3 rounded w-full ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          {/* PHONE (OPTIONAL) */}
          <div>
            <label className="block mb-2 font-semibold">
              Phone <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="tel"
              {...register("phone")}
              className={`border p-3 rounded w-full ${
                errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block mb-2 font-semibold">Message *</label>
            <textarea
              rows={5}
              {...register("message")}
              className={`border p-3 rounded w-full ${
                errors.message ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            ></textarea>
            {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
          </div>

          {/* TURNSTILE CAPTCHA */}
          <div>
            <div id="turnstile-container" />

            {!captchaReady && (
              <p className="text-sm text-gray-500">Loading CAPTCHA…</p>
            )}

            {errors.turnstileToken && (
              <p className="text-red-600 text-sm">{errors.turnstileToken.message}</p>
            )}

            <input type="hidden" {...register("turnstileToken")} />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || !captchaReady}
            className="w-full bg-primary text-white py-4 rounded-lg text-lg flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
