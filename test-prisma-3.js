const { PrismaClient } = require("@prisma/client");

try {
  const p1 = new PrismaClient({});
  console.log("Success with empty object!");
} catch (e) {
  console.log("Error with empty object:", e.message);
}
