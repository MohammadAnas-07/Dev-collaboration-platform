const path = require("path");

console.log("Resolve @prisma/client:", require.resolve("@prisma/client"));
console.log("Keys of @prisma/client:", Object.keys(require("@prisma/client")));

const clientPath = require.resolve("@prisma/client");
const fs = require("fs");
console.log("Contents of", clientPath, ":\n", fs.readFileSync(clientPath, "utf-8"));
