"use client";

import { useEffect, useState } from "react";
import { getActivities } from "@/app/actions/repo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Activity as ActivityIcon } from "lucide-react";

export function ActivityFeed({ repoId }: { repoId: string }) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getActivities(repoId);
      setActivities(data);
    }
    load();
    const interval = setInterval(load, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [repoId]);

  return (
    <div className="border rounded-xl glass overflow-hidden flex flex-col h-full shadow-lg">
      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-indigo-400">
          <ActivityIcon className="h-3.5 w-3.5" /> Recent Activity
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {activities.length === 0 && (
            <div className="text-xs text-muted-foreground italic text-center py-8">
              No recent activity found.
            </div>
          )}
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 group/item">
              <div className="relative">
                <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                  <AvatarImage src={activity.user.image} />
                  <AvatarFallback className="text-xs font-bold bg-indigo-500/10 text-indigo-400">
                    {activity.user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-background border-2 border-background flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs leading-relaxed">
                  <span className="font-bold text-foreground">
                    {activity.user.name}
                  </span>{" "}
                  <span className="text-muted-foreground">{activity.description}</span>
                </p>
                <p className="text-[10px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-wider">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
