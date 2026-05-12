import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY || "sk_mock", {
  apiVersion: "2026-04-22.dahlia",
  appInfo: {
    name: "Forge",
    version: "0.1.0",
  },
});
