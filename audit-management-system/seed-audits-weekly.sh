#!/usr/bin/env bash
set -e

API_URL="http://localhost:3002/api/audits"

LEAD_AUDITOR_ID="69411ad72336e49be6addf52"
SUPPORT_AUDITOR_ID="69411be72336e49be6ade0a6"
PRIMARY_AUDITEE_ID="69411c312336e49be6ade104"

COMPANIES=(
  "6940efed2336e49be6adb44f"
  "6940efed2336e49be6adb450"
  "6940efed2336e49be6adb451"
  "6940efed2336e49be6adb452"
  "6940efed2336e49be6adb453"
  "6940efed2336e49be6adb454"
  "6940efed2336e49be6adb455"
)

PURPOSES=(
  "Routine GMP compliance audit"
  "Supplier qualification audit"
  "Regulatory readiness assessment"
  "Quality system effectiveness review"
  "Pre-inspection preparedness audit"
  "Risk-based internal audit"
)

SCOPES=(
  "Manufacturing operations and batch records"
  "Quality management system and CAPA"
  "Warehousing and GDP compliance"
  "Documentation, training, and SOP control"
  "Validation and equipment qualification"
  "Change control and deviation management"
)

START_DATE="2025-12-18"
END_DATE="2026-02-12"

current="$START_DATE"
company_index=0

while [[ "$current" < "$END_DATE" ]]; do
  audits_this_week=$((RANDOM % 6 + 3)) # 3–8

  for ((i=0; i<audits_this_week; i++)); do
    company="${COMPANIES[$company_index]}"
    company_index=$(( (company_index + 1) % ${#COMPANIES[@]} ))

    purpose="${PURPOSES[$RANDOM % ${#PURPOSES[@]}]}"
    scope="${SCOPES[$RANDOM % ${#SCOPES[@]}]}"

    start_iso=$(date -j -f "%Y-%m-%d" "$current" "+%Y-%m-%dT09:00:00.000Z")
    end_iso=$(date -j -v+2d -f "%Y-%m-%d" "$current" "+%Y-%m-%dT17:00:00.000Z")

    echo "Creating audit ($current)"

    curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"reference\": \"Scheduled Audit – $current\",
        \"isDraft\": false,
        \"companyId\": \"$company\",
        \"auditeeIds\": [\"$PRIMARY_AUDITEE_ID\"],
        \"auditeeId\": \"$PRIMARY_AUDITEE_ID\",
        \"leadAuditorId\": \"$LEAD_AUDITOR_ID\",
        \"supportAuditorIds\": [\"$SUPPORT_AUDITOR_ID\"],
        \"purpose\": \"$purpose\",
        \"scope\": \"$scope\",
        \"expectedStart\": \"$start_iso\",
        \"expectedEnd\": \"$end_iso\"
      }" >/dev/null
  done

  current=$(date -j -v+7d -f "%Y-%m-%d" "$current" "+%Y-%m-%d")
done

echo "✅ Weekly audits seeded successfully"
