"use server";

import { getPrisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createCheckoutSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  
  const userId = (session.user as any).id;
  
  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new Error("STRIPE_PRICE_ID is not configured in environment variables.");
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/settings/billing?canceled=true`,
      metadata: {
        userId,
      },
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    redirect(checkoutSession.url);
  } catch (error: any) {
    console.error("STRIPE_CHECKOUT_ERROR:", error.message);
    throw new Error(error.message);
  }
}

export async function createPortalSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  
  const userId = (session.user as any).id;
  const prisma = getPrisma();
  
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId
  );

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeSubscription.customer as string,
    return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/settings/billing`,
  });

  redirect(portalSession.url);
}
