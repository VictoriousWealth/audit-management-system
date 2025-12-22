#!/usr/bin/env node
/* eslint-disable no-console */

const process = require("node:process");

const SEED_ENABLED = process.env.SEED_AUDITS === "true";

if (!SEED_ENABLED) {
  console.log("⏭️  SEED_AUDITS not enabled — skipping");
  process.exit(0);
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";
const apiUrl = `${baseUrl.startsWith("http") ? baseUrl : `http://${baseUrl}`}/api/audits`;

const LEAD_AUDITOR_ID = "69411ad72336e49be6addf52";
const SUPPORT_AUDITOR_ID = "69411be72336e49be6ade0a6";
const PRIMARY_AUDITEE_ID = "69411c312336e49be6ade104";

const COMPANIES = [
  "6940efed2336e49be6adb44f",
  "6940efed2336e49be6adb450",
  "6940efed2336e49be6adb451",
  "6940efed2336e49be6adb452",
  "6940efed2336e49be6adb453",
  "6940efed2336e49be6adb454",
  "6940efed2336e49be6adb455",
];

const PURPOSES = [
  "Routine GMP compliance audit",
  "Supplier qualification audit",
  "Regulatory readiness assessment",
  "Quality system effectiveness review",
  "Pre-inspection preparedness audit",
  "Risk-based internal audit",
];

const SCOPES = [
  "Manufacturing operations and batch records",
  "Quality management system and CAPA",
  "Warehousing and GDP compliance",
  "Documentation, training, and SOP control",
  "Validation and equipment qualification",
  "Change control and deviation management",
];

const START_DATE = "2025-12-18";
const END_DATE = "2026-02-12";

const toDate = (ymd) => new Date(`${ymd}T00:00:00Z`);
const addDays = (date, days) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};
const formatYMD = (date) => date.toISOString().slice(0, 10);
const isoStart = (date) =>
  new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      9,
      0,
      0,
      0
    )
  ).toISOString();
const isoEndPlus2d = (date) =>
  new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + 2,
      17,
      0,
      0,
      0
    )
  ).toISOString();

const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("Fetch is not available in this environment.");
  }

  let current = toDate(START_DATE);
  const endDate = toDate(END_DATE);
  let companyIndex = 0;

  while (current.getTime() < endDate.getTime()) {
    const auditsThisWeek = Math.floor(Math.random() * 6) + 3; // 3–8 audits

    for (let i = 0; i < auditsThisWeek; i += 1) {
      const companyId = COMPANIES[companyIndex];
      companyIndex = (companyIndex + 1) % COMPANIES.length;

      const purpose = randomItem(PURPOSES);
      const scope = randomItem(SCOPES);
      const startIso = isoStart(current);
      const endIso = isoEndPlus2d(current);
      const referenceDate = formatYMD(current);

      const payload = {
        reference: `Scheduled Audit – ${referenceDate}`,
        isDraft: false,
        companyId,
        auditeeIds: [PRIMARY_AUDITEE_ID],
        auditeeId: PRIMARY_AUDITEE_ID,
        leadAuditorId: LEAD_AUDITOR_ID,
        supportAuditorIds: [SUPPORT_AUDITOR_ID],
        purpose,
        scope,
        expectedStart: startIso,
        expectedEnd: endIso,
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("❌ Failed to create audit", res.status, body);
      } else {
        console.log(`✅ Created audit for ${referenceDate}`);
      }
    }

    current = addDays(current, 7);
  }

  console.log("✅ Weekly audits seeded successfully");
}

main().catch((err) => {
  console.error("❌ Seeding failed", err);
  process.exitCode = 1;
});
