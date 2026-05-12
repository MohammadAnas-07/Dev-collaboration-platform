import { getPrisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { createCheckoutSession, createPortalSession } from "@/app/actions/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  
  const prisma = getPrisma();
  const userId = (session.user as any).id;
  
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
  });

  const isPro = subscription?.plan === "PRO";

  const features = {
    free: [
      "Up to 3 Public Repositories",
      "Basic AI Assistance (GPT-3.5)",
      "Standard Code Editor",
      "Community Support",
    ],
    pro: [
      "Unlimited Private Repositories",
      "Advanced Forge AI (GPT-4o)",
      "Collaborative Code Review",
      "Priority Support",
      "Custom AI Prompts",
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your plan and usage limits for Forge Intelligence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card className={`glass ${!isPro ? "border-indigo-500/50 bg-indigo-500/5" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free Plan</CardTitle>
              {!isPro && <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">Active</span>}
            </div>
            <CardDescription>Perfect for individual developers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-2">
              {features.free.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-400" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {!isPro ? (
              <Button disabled className="w-full">Current Plan</Button>
            ) : (
              <Button variant="outline" className="w-full">Downgrade (Contact Support)</Button>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className={`glass relative overflow-hidden ${isPro ? "border-indigo-500/50 bg-indigo-500/5" : ""}`}>
          <div className="absolute top-0 right-0 p-3">
             <Zap className="h-12 w-12 text-indigo-500/10 rotate-12" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Forge Pro <Sparkles className="h-4 w-4 text-indigo-400" />
              </CardTitle>
              {isPro && <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">Active</span>}
            </div>
            <CardDescription>Power your team with AI-driven collaboration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-2">
              {features.pro.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-indigo-400" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <form action={createPortalSession} className="w-full">
                <Button className="w-full gap-2 glow">
                  <CreditCard className="h-4 w-4" /> Manage Subscription
                </Button>
              </form>
            ) : (
              <form action={createCheckoutSession} className="w-full">
                <Button className="w-full gap-2 glow group">
                  Upgrade to Pro <Zap className="h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
                </Button>
              </form>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
