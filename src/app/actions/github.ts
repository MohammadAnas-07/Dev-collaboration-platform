"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getAccessToken() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const account = await getPrisma().account.findFirst({
    where: { userId: (session.user as any).id, provider: "github" },
  });

  return account?.access_token || null;
}

export async function getGitHubRepos() {
  const token = await getAccessToken();
  if (!token) return [];

  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=10", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return [];
  return response.json();
}

export async function importGitHubRepo(repoName: string, repoDescription: string, repoUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  
  const token = await getAccessToken();
  if (!token) throw new Error("GitHub token not found. Please sign in again.");

  const prisma = getPrisma();
  const userId = (session.user as any).id;

  // Extract owner and repo from URL
  const urlParts = repoUrl.replace("https://github.com/", "").split("/");
  const owner = urlParts[0];
  const repo = urlParts[1];

  // 1. Get default branch
  const repoInfo = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

  const defaultBranch = repoInfo.default_branch || "main";

  // 2. Fetch the file tree
  const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());

  // 3. Filter for files (limit to 20 files for now to avoid timeout)
  const filesToImport = treeResponse.tree
    .filter((item: any) => item.type === "blob")
    .slice(0, 30); // Increased to 30 files

  // 4. Fetch content for each file
  const fileData = await Promise.all(
    filesToImport.map(async (item: any) => {
      try {
        const contentResponse = await fetch(item.url, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.json());
        
        const content = Buffer.from(contentResponse.content, "base64").toString("utf-8");
        
        return {
          name: item.path,
          content: content,
          language: item.path.split(".").pop() || "plaintext",
        };
      } catch (e) {
        console.error(`Failed to fetch content for ${item.path}:`, e);
        return null;
      }
    })
  );

  const validFiles = fileData.filter(Boolean);

  let repository;
  try {
    repository = await prisma.repository.create({
      data: {
        name: repoName,
        description: repoDescription,
        ownerId: userId,
        files: {
          create: validFiles.map((file: any) => ({
            name: file.name,
            content: file.content,
            language: file.language,
          })),
        },
      },
    });
  } catch (error: any) {
    console.error("PRISMA CREATE ERROR:", error);
    throw new Error(`Failed to create repository in database: ${error.message}`);
  }

  try {
    await prisma.activity.create({
      data: {
        type: "REPO_IMPORT",
        description: `Imported repository ${repoName} with ${validFiles.length} files`,
        userId,
        repositoryId: repository.id,
      },
    });
  } catch (error) {
    console.error("ACTIVITY CREATE ERROR:", error);
    // Non-fatal, just log it
  }

  revalidatePath("/dashboard");
  return repository;
}
