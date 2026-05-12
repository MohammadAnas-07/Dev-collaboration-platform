import { CreateRepoDialog } from "@/components/create-repo-dialog";
import { GitHubImportDialog } from "@/components/github-import-dialog";
import { getRepositories } from "@/app/actions/repo";
export const dynamic = "force-dynamic";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, GitBranch, Star, Users } from "lucide-react";

export default async function DashboardPage() {
  const repositories = await getRepositories();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Your Repositories</h1>
          <p className="text-muted-foreground">
            Manage your code, collaboration, and AI integrations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GitHubImportDialog />
          <CreateRepoDialog />
        </div>
      </div>

      {repositories.length === 0 ? (
        <Card className="border-dashed glass bg-muted/20">
          <CardHeader className="text-center py-12">
            <div className="mx-auto bg-indigo-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Book className="text-indigo-400 h-6 w-6" />
            </div>
            <CardTitle>No repositories yet</CardTitle>
            <CardDescription>
              Create your first repository to start building with Forge AI.
            </CardDescription>
            <div className="mt-6">
              <CreateRepoDialog />
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repositories.map((repo: any) => (
            <Link href={`/repo/${repo.id}`} key={repo.id} className="group perspective-1000">
              <Card className="glass transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-1 group-hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] hover:border-indigo-500/50 hover:bg-indigo-500/5 h-full flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="text-indigo-400 border-indigo-400/30 bg-indigo-500/5"
                    >
                      {repo.isPrivate ? "Private" : "Public"}
                    </Badge>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {new Date(repo.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-indigo-400 transition-colors text-xl font-bold">
                    {repo.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-zinc-400">
                    {repo.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <div className="mt-auto p-6 pt-0 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <span>TypeScript</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                    <Star className="h-3 w-3" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
                    <GitBranch className="h-3 w-3" />
                    <span>0</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 glass flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 rounded">
            <Book className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">{repositories.length}</div>
            <div className="text-xs text-muted-foreground">Total Repos</div>
          </div>
        </Card>
        <Card className="p-4 glass flex items-center gap-4">
          <div className="p-2 bg-green-500/10 rounded">
            <GitBranch className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Active Pulls</div>
          </div>
        </Card>
        <Card className="p-4 glass flex items-center gap-4">
          <div className="p-2 bg-amber-500/10 rounded">
            <Star className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Starred</div>
          </div>
        </Card>
        <Card className="p-4 glass flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 rounded">
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-xs text-muted-foreground">Colleagues</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
