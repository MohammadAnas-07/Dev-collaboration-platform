const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

try {
  const p1 = new PrismaClient({ adapter });
  console.log("Success with adapter!");
} catch (e) {
  console.log("Error with adapter:", e.message);
}
