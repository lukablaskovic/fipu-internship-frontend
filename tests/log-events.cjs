const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
 const source = fs.readFileSync(path.join(__dirname, "../src/helpers/log-events.js"), "utf8");
 const { searchAndSortEvents } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
 const events = [{ student_ime: "Željko", student_prezime: "Horvat", timestamp: "2026-01-01", student_JMBAG: "001" }, { student_ime: "Ana", student_email: "ana@test.hr", timestamp: "2026-02-01" }, { timestamp: "2026-03-01" }];
 assert.deepEqual(searchAndSortEvents(events, " ŽELJKO HORVAT ", "newest"), [events[0]]);
 assert.deepEqual(searchAndSortEvents(events, "001", "newest"), [events[0]]);
 assert.deepEqual(searchAndSortEvents(events, "TEST.HR", "newest"), [events[1]]);
 assert.deepEqual(searchAndSortEvents(events, "missing", "newest"), []);
 assert.deepEqual(searchAndSortEvents(events, "", "newest"), [...events].reverse());
 assert.deepEqual(searchAndSortEvents(events, "", "oldest"), events);
 assert.deepEqual(searchAndSortEvents(events.slice(0, 2), "", "student"), [events[1], events[0]]);
 assert.deepEqual(searchAndSortEvents(events, "", (a, b) => new Date(a.timestamp) - new Date(b.timestamp)), events);
 assert.equal(events[0].student_ime, "Željko");
 console.log("Log search and sorting checks passed.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
