const { defineConfig } = require("cypress");
const { execSync } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { decryptAll } = require("./cypress/support/crypto");

// ── Helper: check if a URL responds with HTTP 200 ────────
function isReachable(url, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

// ── Helper: boot the Android emulator if not running ─────
function ensureEmulatorRunning() {
  const ANDROID_HOME =
    process.env.ANDROID_HOME || `${process.env.HOME}/Library/Android/sdk`;
  const adb = `${ANDROID_HOME}/platform-tools/adb`;
  const emulator = `${ANDROID_HOME}/emulator/emulator`;
  const avd = process.env.AVD_NAME || "Medium_Phone_API_36.1";

  try {
    const devices = execSync(`${adb} devices`, { encoding: "utf8" });
    if (/emulator-\d+\s+device/.test(devices)) {
      console.log("✅ Android emulator is already running.");
      // Dismiss any stale crash dialogs
      try {
        execSync(
          `${adb} shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS`,
          { timeout: 5000 }
        );
      } catch (_) {
        /* ok */
      }
      return;
    }
  } catch (_) {
    /* adb not found – will try to launch below */
  }

  console.log(`ℹ️  Starting Android emulator (AVD: ${avd})…`);
  // Launch emulator detached via login shell so it picks up
  // ANDROID_HOME / PATH correctly regardless of Cypress's Node env.
  require("child_process").spawn(
    "/bin/zsh",
    ["-l", "-c", `${emulator} -avd "${avd}" -no-snapshot-load -no-audio -no-window -gpu swiftshader_indirect &`],
    { detached: true, stdio: "ignore" }
  ).unref();

  // Wait for boot_completed
  const maxWait = 120; // seconds
  let waited = 0;
  while (waited < maxWait) {
    try {
      const boot = execSync(`${adb} shell getprop sys.boot_completed 2>/dev/null`, {
        encoding: "utf8",
        timeout: 5000,
      });
      if (boot.trim() === "1") {
        console.log(`✅ Emulator booted in ${waited}s.`);
        // Give the system extra time to stabilize after cold boot
        console.log("ℹ️  Waiting for system to stabilize…");
        execSync("sleep 10");
        // Dismiss any ANR crash dialogs via adb
        try {
          execSync(
            `${adb} shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS`,
            { timeout: 5000 }
          );
        } catch (_) {
          /* ok */
        }
        return;
      }
    } catch (_) {
      /* not ready yet */
    }
    execSync("sleep 5");
    waited += 5;
    process.stdout.write(`  ⏳ ${waited}s…\r`);
  }
  throw new Error(`Emulator did not boot within ${maxWait}s`);
}

// ── Helper: start Appium if not running ──────────────────
function ensureAppiumRunning(port) {
  const url = `http://127.0.0.1:${port}`;

  try {
    const out = execSync(`curl -sf ${url}/status`, {
      encoding: "utf8",
      timeout: 5000,
    });
    if (out.includes('"ready":true')) {
      console.log(`✅ Appium is already listening on ${url}.`);
      return;
    }
  } catch (_) {
    /* not running */
  }

  console.log(`ℹ️  Starting Appium server on port ${port}…`);
  // Cypress injects tsx hooks into NODE_OPTIONS which break Appium.
  // Build a clean env that strips those hooks.
  const cleanEnv = Object.assign({}, process.env);
  delete cleanEnv.NODE_OPTIONS;
  delete cleanEnv.CYPRESS_INTERNAL_ENV;
  // Remove any key that Cypress or tsx injects
  Object.keys(cleanEnv).forEach((k) => {
    if (k.startsWith("CYPRESS_INTERNAL") || k.startsWith("__CYPRESS")) {
      delete cleanEnv[k];
    }
  });

  require("child_process").spawn(
    "/bin/zsh",
    ["-l", "-c", `appium server --port ${port} --allow-cors > /tmp/appium-server.log 2>&1`],
    { detached: true, stdio: "ignore", env: cleanEnv }
  ).unref();

  const maxWait = 60;
  let waited = 0;
  while (waited < maxWait) {
    try {
      const out = execSync(`curl -sf ${url}/status`, {
        encoding: "utf8",
        timeout: 3000,
      });
      if (out.includes('"ready":true')) {
        console.log(`✅ Appium server ready in ${waited}s.`);
        return;
      }
    } catch (_) {
      /* not ready */
    }
    execSync("sleep 2");
    waited += 2;
  }
  throw new Error(
    `Appium did not start within ${maxWait}s – check /tmp/appium-server.log`
  );
}

module.exports = defineConfig({
  projectId: "duf1he",
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 10000,
  reporter: "cypress-mochawesome-reporter",
  env: {
    appiumUrl: "http://127.0.0.1:4723",
    appiumPort: 4723,
    deviceName: "emulator-5554",
    avdName: "Medium_Phone_API_36.1",
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    baseUrl: "http://localhost:4000",
    specPattern: "cypress/integration/examples/*.js",
    setupNodeEvents(on, config) {
      // ── Credentials decryption task ──────────────────────
      const credKey = process.env.CREDENTIALS_KEY || config.env.credentialsKey;
      on("task", {
        decryptFixture({ fixtureName }) {
          const filePath = path.resolve(
            __dirname,
            "cypress",
            "fixtures",
            `${fixtureName}.json`
          );
          const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
          if (!credKey) {
            console.warn("⚠️  CREDENTIALS_KEY not set – returning raw fixture");
            return raw;
          }
          return decryptAll(raw, credKey);
        },
      });

      // ── Auto-start emulator & Appium before tests ───────
      const port = config.env.appiumPort || 4723;

      // 1. Ensure Android emulator is booted
      ensureEmulatorRunning();

      // 2. Ensure Appium server is listening
      ensureAppiumRunning(port);

      // 3. Detect the connected device name and expose it
      try {
        const ANDROID_HOME =
          process.env.ANDROID_HOME ||
          `${process.env.HOME}/Library/Android/sdk`;
        const adb = `${ANDROID_HOME}/platform-tools/adb`;
        const devices = execSync(`${adb} devices`, { encoding: "utf8" });
        const match = devices.match(/(emulator-\d+)\s+device/);
        if (match) {
          config.env.deviceName = match[1];
        }
      } catch (_) {
        /* keep default */
      }

      config.env.appiumUrl = `http://127.0.0.1:${port}`;
      return config;
    },
  },
});
