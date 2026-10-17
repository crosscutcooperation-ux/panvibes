// Re-import the locally bundled assets from their recorded source URLs.
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tasks = JSON.parse(
  await fs.readFile(
    path.join(root, "public", "images", "asset-sources.json"),
    "utf8",
  ),
);
let next = 0;
let finished = 0;
const failures = [];
async function worker() {
  while (next < tasks.length) {
    const task = tasks[next++];
    const destination = path.join(root, "public", "images", task.name);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(task.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await fs.writeFile(
          destination,
          new Uint8Array(await response.arrayBuffer()),
        );
        finished++;
        if (finished % 30 === 0)
          console.log(`Imported ${finished}/${tasks.length} assets`);
        break;
      } catch (error) {
        if (attempt === 2)
          failures.push({ name: task.name, error: String(error) });
      }
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(JSON.stringify({ imported: finished, failures }, null, 2));
if (failures.length) process.exitCode = 1;
