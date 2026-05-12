"use server";

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createRepository(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  
  const prisma = getPrisma();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const userId = (session.user as any).id; 

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      name: session.user.name || "Developer",
      email: session.user.email || "dev@forge.com",
    },
  });

  const repository = await prisma.repository.create({
    data: {
      name,
      description,
      ownerId: user.id,
      files: {
        create: [
          {
            name: "README.md",
            content: `# ${name}\n\n${description || "Welcome to your new repository."}`,
            language: "markdown",
          },
          {
            name: "index.ts",
            content: `export function hello() {\n  console.log("Hello from ${name}!");\n}\n\nhello();`,
            language: "typescript",
          },
          {
            name: "styles.css",
            content: `/* Styles for ${name} */\nbody {\n  background: #000;\n  color: #fff;\n  font-family: sans-serif;\n}`,
            language: "css",
          },
          {
            name: ".gitignore",
            content: "node_modules\n.next\n.env\ndist",
            language: "plaintext",
          },
        ],
      },
    },
  });

  await prisma.activity.create({
    data: {
      type: "REPO_CREATE",
      description: `Created repository ${name}`,
      userId: user.id,
      repositoryId: repository.id,
    },
  });

  revalidatePath("/dashboard");
  return repository;
}

export async function getRepositories() {
  // Build-time safety check
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
    return [];
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return [];
    
    const prisma = getPrisma();
    const userId = (session.user as any).id;
    return prisma.repository.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    return [];
  }
}

export async function updateFileContent(fileId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  
  const prisma = getPrisma();
  const file = await prisma.file.update({
    where: { id: fileId },
    data: { content },
  });

  await prisma.activity.create({
    data: {
      type: "FILE_UPDATE",
      description: `Updated content of ${file.name}`,
      userId: (session.user as any).id,
      repositoryId: file.repositoryId,
    },
  });

  revalidatePath(`/repo/${file.repositoryId}`);
  return file;
}

export async function createFile(repositoryId: string, name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const prisma = getPrisma();
  const file = await prisma.file.create({
    data: {
      name,
      content: "",
      language: name.endsWith(".ts") ? "typescript" : name.endsWith(".css") ? "css" : "plaintext",
      repositoryId,
    },
  });

  const userId = (session.user as any).id;
  await prisma.activity.create({
    data: {
      type: "FILE_CREATE",
      description: `Created file ${name}`,
      userId,
      repositoryId,
    },
  });

  revalidatePath(`/repo/${repositoryId}`);
  return file;
}

export async function deleteFile(fileId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const prisma = getPrisma();
  const file = await prisma.file.delete({
    where: { id: fileId },
  });

  await prisma.activity.create({
    data: {
      type: "FILE_DELETE",
      description: `Deleted file ${file.name}`,
      userId: (session.user as any).id,
      repositoryId: file.repositoryId,
    },
  });

  revalidatePath(`/repo/${file.repositoryId}`);
  return file;
}

export async function renameFile(fileId: string, newName: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const prisma = getPrisma();
  const file = await prisma.file.update({
    where: { id: fileId },
    data: { name: newName },
  });

  await prisma.activity.create({
    data: {
      type: "FILE_RENAME",
      description: `Renamed file to ${newName}`,
      userId: (session.user as any).id,
      repositoryId: file.repositoryId,
    },
  });

  revalidatePath(`/repo/${file.repositoryId}`);
  return file;
}

export async function getActivities(repositoryId: string) {
  const prisma = getPrisma();
  return prisma.activity.findMany({
    where: { repositoryId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
