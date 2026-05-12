"use client";

import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { Save, Loader2, Check, Sparkles, X, Play, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateFileContent } from "@/app/actions/repo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodePreview } from "@/components/code-preview";

interface CodeEditorProps {
  fileId: string;
  initialCode: string;
  language?: string;
  filename?: string;
}

export function CodeEditor({ 
  fileId,
  initialCode, 
  language = "typescript",
  filename = "main.ts" 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { messages, append, isLoading: isReviewing, setMessages } = useChat({
    api: "/api/review",
    body: { code, filename },
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateFileContent(fileId, code);
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReview = async () => {
    setMessages([]);
    setShowReview(true);
    append({ role: "user", content: "Review this code." });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-border/50 relative">
      <div className="flex items-center justify-between p-2 bg-[#252526] border-b border-border/20">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] h-4 uppercase tracking-tighter">
            {language}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {filename}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className={`h-7 text-xs gap-2 ${showPreview ? "text-cyan-400 bg-cyan-500/10" : "hover:bg-cyan-500/10 hover:text-cyan-400"}`}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Layout className="h-3 w-3" />
            {showPreview ? "Hide Preview" : "Preview"}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 text-xs gap-2 text-indigo-400 hover:bg-indigo-500/10"
            onClick={handleReview}
            disabled={isReviewing}
          >
            {isReviewing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            AI Review
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className={`h-7 text-xs gap-2 transition-all ${
              hasSaved ? "text-green-400 bg-green-500/10" : "hover:bg-indigo-500/10 hover:text-indigo-400"
            }`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : hasSaved ? (
              <Check className="h-3 w-3" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            {hasSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-[400px] flex">
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              padding: { top: 16 },
            }}
          />
        </div>
        {showPreview && (
          <div className="w-1/2 bg-white border-l border-border/20 animate-in slide-in-from-right duration-300">
            <CodePreview code={code} language={language} />
          </div>
        )}
        {showReview && (
          <div className="w-80 bg-[#252526] border-l border-border/20 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-2 border-b border-border/20 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-indigo-400" /> AI Review
              </span>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setShowReview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="text-xs space-y-4 text-zinc-300">
                {messages.filter(m => m.role === "assistant").map((m) => (
                  <div key={m.id} className="whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </div>
                ))}
                {isReviewing && !messages.some(m => m.role === "assistant") && (
                  <div className="flex items-center gap-2 text-muted-foreground italic">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing code...
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
