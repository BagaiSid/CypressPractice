#!/usr/bin/env zsh
# ─────────────────────────────────────────────────────────────
# start-mobile-env.sh
#
# Boots the Android emulator and Appium server if they are not
# already running, waits until both are ready, then executes
# the Cypress test suite for the HR Dashboard mobile app.
#
# Usage:
#   ./scripts/start-mobile-env.sh          # headless (run mode)
#   ./scripts/start-mobile-env.sh --open   # interactive (open mode)
# ─────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Configuration ────────────────────────────────────────────
ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
EMULATOR_BIN="$ANDROID_HOME/emulator/emulator"
ADB_BIN="$ANDROID_HOME/platform-tools/adb"
AVD_NAME="${AVD_NAME:-Medium_Phone_API_36.1}"
APPIUM_PORT="${APPIUM_PORT:-4723}"
APPIUM_HOST="127.0.0.1"
APPIUM_URL="http://${APPIUM_HOST}:${APPIUM_PORT}"

EMULATOR_BOOT_TIMEOUT=120   # seconds
APPIUM_READY_TIMEOUT=30     # seconds

STARTED_EMULATOR=false
STARTED_APPIUM=false

# ── Helpers ──────────────────────────────────────────────────
info()  { echo "ℹ️  $*"; }
ok()    { echo "✅ $*"; }
fail()  { echo "❌ $*" >&2; exit 1; }

cleanup() {
  if $STARTED_APPIUM; then
    info "Stopping Appium server (PID $APPIUM_PID)…"
    kill "$APPIUM_PID" 2>/dev/null || true
  fi
  # We intentionally do NOT kill the emulator – it takes a long
  # time to boot and the user may want it to stay up.
}
trap cleanup EXIT

# ── 1. Android Emulator ─────────────────────────────────────
emulator_running() {
  "$ADB_BIN" devices 2>/dev/null | grep -q "emulator-.*device"
}

boot_completed() {
  "$ADB_BIN" shell getprop sys.boot_completed 2>/dev/null | grep -q "1"
}

if emulator_running && boot_completed; then
  ok "Android emulator is already running and booted."
else
  info "Starting Android emulator (AVD: $AVD_NAME)…"
  "$EMULATOR_BIN" -avd "$AVD_NAME" -no-snapshot-load -no-audio -no-window -gpu swiftshader_indirect &
  EMULATOR_PID=$!
  STARTED_EMULATOR=true

  info "Waiting for emulator to boot (timeout: ${EMULATOR_BOOT_TIMEOUT}s)…"
  elapsed=0
  while ! boot_completed; do
    if (( elapsed >= EMULATOR_BOOT_TIMEOUT )); then
      fail "Emulator did not boot within ${EMULATOR_BOOT_TIMEOUT}s."
    fi
    sleep 5
    elapsed=$((elapsed + 5))
    printf "  ⏳ %ds…\r" "$elapsed"
  done
  echo ""
  ok "Emulator booted in ${elapsed}s."
fi

DEVICE_NAME=$("$ADB_BIN" devices | grep "emulator-" | head -1 | awk '{print $1}')
info "Device: $DEVICE_NAME"

# ── 2. Appium Server ────────────────────────────────────────
appium_ready() {
  curl -sf "${APPIUM_URL}/status" >/dev/null 2>&1
}

if appium_ready; then
  ok "Appium server already listening on ${APPIUM_URL}."
else
  info "Starting Appium server on port ${APPIUM_PORT}…"
  appium server --port "$APPIUM_PORT" --allow-cors \
    --log-timestamp --log-no-colors \
    > /tmp/appium-server.log 2>&1 &
  APPIUM_PID=$!
  STARTED_APPIUM=true

  elapsed=0
  while ! appium_ready; do
    if (( elapsed >= APPIUM_READY_TIMEOUT )); then
      fail "Appium did not start within ${APPIUM_READY_TIMEOUT}s. Check /tmp/appium-server.log"
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  ok "Appium server ready in ${elapsed}s (PID $APPIUM_PID)."
fi

# ── 3. Run Cypress ───────────────────────────────────────────
cd "$PROJECT_DIR"

CYPRESS_MODE="run"
CYPRESS_EXTRA_ARGS=()
if [[ "${1:-}" == "--open" ]]; then
  CYPRESS_MODE="open"
fi

info "Running Cypress in '${CYPRESS_MODE}' mode…"
npx cypress "$CYPRESS_MODE" \
  --config specPattern="cypress/integration/examples/HRDashboardMobile.js" \
  --env appiumUrl="${APPIUM_URL}",deviceName="${DEVICE_NAME}" \
  "${CYPRESS_EXTRA_ARGS[@]}"

ok "Done."
