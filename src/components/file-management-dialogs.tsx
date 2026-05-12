"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFile, deleteFile, renameFile } from "@/app/actions/repo";

export function CreateFileDialog({ repoId }: { repoId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name) return;
    setLoading(true);
    try {
      await createFile(repoId, name);
      setOpen(false);
      setName("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Enter the name of the file you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">File Name</Label>
            <Input
              id="name"
              placeholder="index.ts"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading || !name} className="glow">
            {loading ? "Creating..." : "Create File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteFileDialog({ fileId, fileName }: { fileId: string; fileName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteFile(fileId);
      setOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="icon" variant="ghost" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10">
            <Trash2 className="h-3 w-3" />
          </Button>
        }
      />
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">{fileName}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="destructive" disabled={loading}>
            {loading ? "Deleting..." : "Delete File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RenameFileDialog({ fileId, currentName }: { fileId: string; currentName: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  async function handleRename() {
    if (!name || name === currentName) return;
    setLoading(true);
    try {
      await renameFile(fileId, name);
      setOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="icon" variant="ghost" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit2 className="h-3 w-3" />
          </Button>
        }
      />
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>
            Enter a new name for <span className="font-semibold text-foreground">{currentName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rename">New Name</Label>
            <Input
              id="rename"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRename} disabled={loading || !name || name === currentName} className="glow">
            {loading ? "Renaming..." : "Rename File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
