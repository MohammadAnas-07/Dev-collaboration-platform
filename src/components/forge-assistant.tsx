"use client";

import { useChat } from "ai/react";
import { Bot, Play, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

export function ForgeAssistant({ repoId }: { repoId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { repoId },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="md:col-span-2 glass flex flex-col h-[500px]">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold">Forge Assistant</span>
          </div>
          <Badge
            variant="outline"
            className="bg-indigo-500/10 text-indigo-400 border-indigo-400/20"
          >
            GPT-4o mini
          </Badge>
        </div>
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="bg-muted/50 rounded-lg p-3 max-w-[80%] text-sm">
                Hello! I'm Forge Intelligence. I can help you review code, write tests, or explain complex logic in this repository.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg p-3 max-w-[80%] text-sm ${
                  m.role === "user"
                    ? "bg-indigo-500 text-white ml-auto"
                    : "bg-muted/50"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Forge about this repo..."
              className="bg-background/50"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="shrink-0"
              type="submit"
              disabled={isLoading || !input}
            >
              <Play className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
      <div className="space-y-4">
        <Card className="p-4 glass">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" /> System Status
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Model Coverage</span>
              <span className="text-cyan-400">98%</span>
            </div>
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-[98%]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
