import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Zap, MessageSquare } from "lucide-react";

export default async function AIDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">AI Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and configure your Forge AI integrations.
          </p>
        </div>
        <Button className="gap-2 glow">
          <Sparkles className="h-4 w-4" /> Upgrade AI Model
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass relative overflow-hidden group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              Usage Stats
            </CardTitle>
            <CardDescription>Your AI token usage for this billing cycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,450</div>
            <p className="text-sm text-muted-foreground mt-1">Tokens consumed</p>
            <div className="w-full bg-zinc-800 rounded-full h-2 mt-4">
              <div className="bg-indigo-500 h-2 rounded-full w-[45%]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">45% of free tier</p>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Active Models
            </CardTitle>
            <CardDescription>The AI models currently powering your repositories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">GPT-3.5 Turbo</span>
              <span className="text-xs font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between opacity-50">
              <span className="text-sm font-medium">GPT-4o (Forge Pro)</span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-500/10 px-2 py-1 rounded">Locked</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-400" />
              Recent Prompts
            </CardTitle>
            <CardDescription>Your latest interactions with Forge AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm border-l-2 border-indigo-500/50 pl-3 py-1 text-muted-foreground">
                "Explain the architecture of this Next.js app..."
              </div>
              <div className="text-sm border-l-2 border-indigo-500/50 pl-3 py-1 text-muted-foreground">
                "Generate a Prisma schema for..."
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
