const fs = require("fs");
const content = fs.readFileSync("node_modules/.prisma/client/index.d.ts", "utf-8");
const lines = content.split("\n");
const start = lines.findIndex(l => l.includes("export interface PrismaClientOptions {"));
if (start !== -1) {
  console.log(lines.slice(start + 30, start + 60).join("\n"));
}
