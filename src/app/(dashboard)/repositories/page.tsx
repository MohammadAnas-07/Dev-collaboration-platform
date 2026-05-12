import { getPrisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RepositoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  
  const prisma = getPrisma();
  const userId = (session.user as any).id;
  
  const repos = await prisma.repository.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage your code repositories and access settings.
          </p>
        </div>
        <Button className="gap-2 glow">
          <Plus className="h-4 w-4" /> New Repository
        </Button>
      </div>

      {repos.length === 0 ? (
        <Card className="glass border-dashed flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <CardTitle>No repositories yet</CardTitle>
          <CardDescription className="max-w-sm mt-2">
            You haven't created any repositories yet. Create your first repository to get started with Forge.
          </CardDescription>
          <Button className="mt-6 gap-2 glow">
            <Plus className="h-4 w-4" /> Create Repository
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <Card key={repo.id} className="glass hover:border-indigo-500/50 transition-colors cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  {repo.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {repo.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    TypeScript
                  </span>
                  <span>{repo.isPrivate ? "Private" : "Public"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
