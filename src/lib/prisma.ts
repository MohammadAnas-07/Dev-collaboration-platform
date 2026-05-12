import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (typeof window !== "undefined") return {} as PrismaClient;
  
  const dbUrl = process.env.DATABASE_URL;
  const isBuildOrMissing = !dbUrl || 
                           dbUrl === "undefined" || 
                           dbUrl.includes("localhost") || 
                           dbUrl.includes("user:password") ||
                           process.env.npm_lifecycle_event === "build";

  if (isBuildOrMissing) {
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === "prototype" || typeof prop === "symbol") return undefined;
        return {
          findMany: async () => [],
          findUnique: async () => null,
          findFirst: async () => null,
          upsert: async () => ({}),
          create: async () => ({}),
          update: async () => ({}),
          delete: async () => ({}),
          count: async () => 0,
        };
      }
    }) as any;
  }

  if (!globalThis.prismaGlobal) {
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalThis.prismaGlobal = new PrismaClient({ adapter });
  }
  return globalThis.prismaGlobal;
}
