import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
if (!existsSync('.next/standalone/server.js')) throw new Error('Run npm run build first');
// Next's standalone output intentionally omits these. Include them for a
// self-contained artifact, or let nginx/CDN serve them from the release root.
cpSync('public', '.next/standalone/public', { recursive: true });
cpSync('.next/static', '.next/standalone/.next/static', { recursive: true });
// Next can copy local build-time dotenv files into standalone. Credentials
// belong in the service environment, not an uploadable deployment artifact.
for (const name of readdirSync('.next/standalone')) {
  if (name === '.env' || name.startsWith('.env.')) rmSync(`.next/standalone/${name}`);
}
console.log('Standalone media and browser bundles staged. Keep runtime secrets outside the release artifact.');
