"use client";

import { useState } from "react";
import { FileCode, History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodeEditor } from "@/components/code-editor";
import { CreateFileDialog, DeleteFileDialog, RenameFileDialog } from "@/components/file-management-dialogs";
import { cn } from "@/lib/utils";

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
  repositoryId: string;
}

interface RepoCodeViewProps {
  repoId: string;
  initialFiles: File[];
}

export function RepoCodeView({ repoId, initialFiles }: RepoCodeViewProps) {
  // Find README or first file
  const readme = initialFiles.find(f => f.name.toLowerCase() === "readme.md");
  const [activeFileId, setActiveFileId] = useState<string | null>(readme?.id || initialFiles[0]?.id || null);

  const activeFile = initialFiles.find(f => f.id === activeFileId);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* File Explorer */}
      <div className="md:col-span-1 border rounded-lg glass overflow-hidden flex flex-col">
        <div className="p-2 bg-muted/50 border-b flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Files
          </span>
          <div className="flex items-center gap-1">
            <CreateFileDialog repoId={repoId} />
            <History className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        <ScrollArea className="flex-1 h-[600px]">
          <div className="p-2 space-y-1">
            {initialFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={cn(
                  "group flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer text-sm transition-colors",
                  activeFileId === file.id ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileCode className={cn("h-4 w-4", activeFileId === file.id ? "text-indigo-400" : "text-muted-foreground")} />
                <span className="flex-1 truncate">{file.name}</span>
                <div className="flex items-center gap-1">
                  <RenameFileDialog fileId={file.id} currentName={file.name} />
                  <DeleteFileDialog fileId={file.id} fileName={file.name} />
                </div>
              </div>
            ))}
            {initialFiles.length === 0 && (
              <div className="text-center py-10 text-xs text-muted-foreground italic">
                No files yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Editor */}
      <div className="md:col-span-3 min-h-[600px]">
        {activeFile ? (
          <CodeEditor 
            key={activeFile.id} // Key ensures remount on file change
            fileId={activeFile.id}
            initialCode={activeFile.content}
            filename={activeFile.name}
            language={activeFile.language}
          />
        ) : (
          <div className="h-full border rounded-lg glass flex flex-col items-center justify-center text-muted-foreground gap-4 p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileCode className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No file selected</p>
              <p className="text-sm">Select a file from the explorer to start coding.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
