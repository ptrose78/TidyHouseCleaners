// /src/lib/booking/config-addons.ts

export const ADD_ONS = [
  { id: "inside_fridge", label: "Inside Fridge", price: 30, icon: "🥶" },
  { id: "inside_oven", label: "Inside Oven", price: 40, icon: "🔥" },
  { id: "baseboards", label: "Baseboards", price: 25, icon: "🧹" },
  { id: "windows", label: "Interior Windows", price: 50, icon: "🪟" },
  { id: "laundry", label: "1 Load Laundry", price: 15, icon: "👕" },
  { id: "dishes", label: "Dishes", price: 10, icon: "🍽️" },
];

export type AddOnItem = typeof ADD_ONS[number];
