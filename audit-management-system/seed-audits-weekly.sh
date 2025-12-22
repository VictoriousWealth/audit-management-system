#!/usr/bin/env bash
set -e


# ------------------------------------------------------------------
# Safety Guard
# ------------------------------------------------------------------
if [[ "$SEED_AUDITS" != "true" ]]; then
  echo "⏭️  SEED_AUDITS not enabled — skipping"
  exit 0
fi


# ------------------------------------------------------------------
# Config
# ------------------------------------------------------------------
API_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3002}/api/audits"

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

# ------------------------------------------------------------------
# OS detection
# ------------------------------------------------------------------
OS="$(uname -s)"

if [[ "$OS" == "Darwin" ]]; then
  IS_MACOS=true
elif [[ "$OS" == "Linux" ]]; then
  IS_LINUX=true
else
  echo "❌ Unsupported OS: $OS"
  exit 1
fi

# ------------------------------------------------------------------
# Date helpers (BSD vs GNU)
# ------------------------------------------------------------------
date_to_epoch() {
  local date="$1"
  if [[ "$IS_MACOS" == true ]]; then
    date -j -f "%Y-%m-%d" "$date" "+%s"
  else
    date -d "$date" "+%s"
  fi
}

date_add_days() {
  local date="$1"
  local days="$2"
  if [[ "$IS_MACOS" == true ]]; then
    date -j -v+"$days"d -f "%Y-%m-%d" "$date" "+%Y-%m-%d"
  else
    date -d "$date +$days days" "+%Y-%m-%d"
  fi
}

date_iso_start() {
  local date="$1"
  if [[ "$IS_MACOS" == true ]]; then
    date -j -f "%Y-%m-%d" "$date" "+%Y-%m-%dT09:00:00.000Z"
  else
    date -d "$date 09:00 UTC" "+%Y-%m-%dT%H:%M:%S.000Z"
  fi
}

date_iso_end_plus_2d() {
  local date="$1"
  if [[ "$IS_MACOS" == true ]]; then
    date -j -v+2d -f "%Y-%m-%d" "$date" "+%Y-%m-%dT17:00:00.000Z"
  else
    date -d "$date +2 days 17:00 UTC" "+%Y-%m-%dT%H:%M:%S.000Z"
  fi
}

# ------------------------------------------------------------------
# Main logic
# ------------------------------------------------------------------
current="$START_DATE"
company_index=0

while [[ "$(date_to_epoch "$current")" -lt "$(date_to_epoch "$END_DATE")" ]]; do
  audits_this_week=$((RANDOM % 6 + 3)) # 3–8 audits per week

  for ((i=0; i<audits_this_week; i++)); do
    company="${COMPANIES[$company_index]}"
    company_index=$(( (company_index + 1) % ${#COMPANIES[@]} ))

    purpose="${PURPOSES[$RANDOM % ${#PURPOSES[@]}]}"
    scope="${SCOPES[$RANDOM % ${#SCOPES[@]}]}"

    start_iso="$(date_iso_start "$current")"
    end_iso="$(date_iso_end_plus_2d "$current")"

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

  current="$(date_add_days "$current" 7)"
done

echo "✅ Weekly audits seeded successfully"
