import { getPrisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ForgeAssistant } from "@/components/forge-assistant";
import { ActivityFeed } from "@/components/activity-feed";
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  FileCode,
  GitBranch,
  History,
  Settings,
  StarIcon,
  Sparkles,
  Activity as ActivityIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateFileDialog, DeleteFileDialog, RenameFileDialog } from "@/components/file-management-dialogs";
import { RepoCodeView } from "@/components/repo-code-view";

export default async function RepositoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  const prisma = getPrisma();
  const repo = await prisma.repository.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      files: true,
    },
  });

  if (!repo) {
    notFound();
  }

  // Active file logic (default to first file or README)
  const activeFile = repo.files.find((f: any) => f.name === "README.md") || repo.files[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ... header ... */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{repo.owner.name}</span>
            <span>/</span>
            <span className="font-semibold text-foreground text-lg">
              {repo.name}
            </span>
            <Badge variant="secondary" className="ml-2">
              Public
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{repo.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass">
            <StarIcon className="mr-2 h-4 w-4" /> Star
            <Badge variant="secondary" className="ml-2 bg-muted/50">
              12
            </Badge>
          </Button>
          <Button variant="outline" size="sm" className="glass">
            <GitBranch className="mr-2 h-4 w-4" /> Fork
            <Badge variant="secondary" className="ml-2 bg-muted/50">
              2
            </Badge>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="bg-muted/30 border-b rounded-none w-full justify-start h-auto p-0 gap-4 overflow-x-auto">
          <TabsTrigger
            value="code"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent px-4 py-2"
          >
            <Code2 className="mr-2 h-4 w-4" /> Code
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent px-4 py-2"
          >
            <Sparkles className="mr-2 h-4 w-4 text-indigo-400" /> AI Forge
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent px-4 py-2"
          >
            <ActivityIcon className="mr-2 h-4 w-4" /> Activity
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent px-4 py-2"
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-4 space-y-4">
          <RepoCodeView repoId={repo.id} initialFiles={repo.files} />
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <ForgeAssistant repoId={repo.id} />
            </div>
            <div className="md:col-span-1">
              <ActivityFeed repoId={repo.id} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="max-w-2xl mx-auto h-[600px]">
            <ActivityFeed repoId={repo.id} />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <div className="border rounded-lg glass p-8 text-center text-muted-foreground italic">
            Repository settings coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
