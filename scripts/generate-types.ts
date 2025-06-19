// scripts/generate-types.ts
import { compile } from "json-schema-to-typescript";
import fs from "fs";
import path from "path";
import { glob } from "glob";

async function generateTypes() {
  const schemaFiles = await glob("schema/*.schema.json"); // glob returns a promise
  let output = "/* eslint-disable */\n// Auto-generated types\n\n";

  for (const file of schemaFiles) {
    const schema = JSON.parse(fs.readFileSync(file, "utf8"));
    const types = await compile(schema, path.basename(file, ".schema.json"));
    output += types + "\n";
  }

  fs.writeFileSync("utils/types.ts", output);
  console.log("Types generated successfully!");
}

generateTypes().catch(console.error);
