/**
 * Run all Sanity import scripts in dependency order.
 *
 * Usage:
 *   node scripts/import/run-all.js
 *
 * Requirements:
 *   - SANITY_WRITE_TOKEN (Editor role) in .env
 *   - npm install has been run
 *
 * Scripts run in order:
 *   1.  Weekdays              (no deps)
 *   2.  Program Categories    (no deps)
 *   3.  Class Recording Topics (no deps, empty)
 *   4.  Lesson Resources      (no deps)
 *   5.  Glossary              (no deps)
 *   6.  Magazine Articles     (no deps)
 *   7.  Teams                 (no deps, uploads images)
 *   8.  Volunteer Positions   (deps: Teams)
 *   9.  Lessons               (deps: Teams, Lesson Resources)
 *   10. Programs              (deps: Weekdays, Program Categories, Teams, uploads images)
 *   11. Courses               (deps: Lessons)
 *   12. Class Recordings      (deps: Teams, Topics, Programs)
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const path = require("path");
const { execSync } = require("child_process");

const scripts = [
  "01-weekdays.js",
  "02-program-categories.js",
  "03-class-recording-topics.js",
  "04-lesson-resources.js",
  "05-glossary.js",
  "06-magazine-articles.js",
  "07-teams.js",
  "08-volunteer-positions.js",
  "09-lessons.js",
  "10-programs.js",
  "11-courses.js",
  "12-class-recordings.js",
];

// Check for write token
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    "❌ No Sanity token found.\n" +
    "   Set SANITY_WRITE_TOKEN in .env with an Editor-role token.\n" +
    "   Get one at: https://www.sanity.io/manage/project/xxgvfpjf/api"
  );
  process.exit(1);
}

const writeToken = process.env.SANITY_WRITE_TOKEN;
if (!writeToken) {
  console.warn(
    "⚠  Using SANITY_API_TOKEN (Viewer token) — write operations will fail.\n" +
    "   Add SANITY_WRITE_TOKEN with an Editor-role token to .env first.\n"
  );
}

console.log("╔══════════════════════════════════════════╗");
console.log("║     RIM Sanity CSV Import — run-all      ║");
console.log("╚══════════════════════════════════════════╝\n");

const startTotal = Date.now();
let passed = 0;
let failed = 0;

for (const script of scripts) {
  const scriptPath = path.join(__dirname, script);
  const start = Date.now();
  console.log(`\n▶ Running ${script}...`);
  try {
    execSync(`node "${scriptPath}"`, { stdio: "inherit" });
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`✓ ${script} completed in ${elapsed}s`);
    passed++;
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.error(`✗ ${script} FAILED after ${elapsed}s`);
    failed++;
    // Continue with remaining scripts even if one fails
  }
}

const totalElapsed = ((Date.now() - startTotal) / 1000).toFixed(1);
console.log(
  `\n╔══════════════════════════════════════════╗`
);
console.log(
  `║ Import complete: ${passed}/${scripts.length} passed, ${failed} failed — ${totalElapsed}s ║`
);
console.log(
  `╚══════════════════════════════════════════╝`
);

if (failed > 0) process.exit(1);
