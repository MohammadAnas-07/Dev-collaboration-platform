const { PrismaClient } = require("@prisma/client");

try {
  const prisma = new PrismaClient();
  console.log("Success with no options");
} catch (e) {
  console.log("Error with no options:", e.message);
}

try {
  const prisma2 = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });
  console.log("Success with datasourceUrl");
} catch (e) {
  console.log("Error with datasourceUrl:", e.message);
}

try {
  const prisma3 = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  console.log("Success with datasources");
} catch (e) {
  console.log("Error with datasources:", e.message);
}
