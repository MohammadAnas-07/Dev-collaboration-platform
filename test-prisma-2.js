const { PrismaClient } = require("@prisma/client");

try {
  const p1 = new PrismaClient({ url: process.env.DATABASE_URL });
  console.log("Success with url");
} catch (e) {
  console.log("Error with url:", e.message);
}

try {
  const p2 = new PrismaClient({ connectionString: process.env.DATABASE_URL });
  console.log("Success with connectionString");
} catch (e) {
  console.log("Error with connectionString:", e.message);
}
