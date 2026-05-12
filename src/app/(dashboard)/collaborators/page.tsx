import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";

export default async function CollaboratorsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Collaborators</h1>
          <p className="text-muted-foreground">
            Manage who has access to your repositories.
          </p>
        </div>
        <Button className="gap-2 glow">
          <UserPlus className="h-4 w-4" /> Invite User
        </Button>
      </div>

      <Card className="glass border-dashed flex flex-col items-center justify-center py-16 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <CardTitle>No Collaborators Found</CardTitle>
        <CardDescription className="max-w-sm mt-2">
          You are currently working solo. Invite other developers to collaborate on your repositories.
        </CardDescription>
        <Button variant="outline" className="mt-6 gap-2">
          <UserPlus className="h-4 w-4" /> Send Invite
        </Button>
      </Card>
    </div>
  );
}
