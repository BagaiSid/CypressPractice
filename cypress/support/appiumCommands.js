/**
 * Cypress Custom Commands for Appium Mobile Automation
 *
 * These commands let Cypress tests drive an Android/iOS app
 * through the Appium server REST API (http://localhost:4723).
 *
 * Usage in tests:
 *   cy.appiumCreateSession(capabilities)
 *   cy.appiumFindElement('xpath', '//android.widget.Button[@text="Login"]')
 *   cy.appiumTap(elementId)
 *   cy.appiumType(elementId, 'hello')
 *   cy.appiumGetPageSource()
 *   cy.appiumScreenshot('login_screen')
 *   cy.appiumDeleteSession()
 */

/** Appium base URL – reads from Cypress.env so cypress.config.js can override it */
function getAppiumBase() {
  return Cypress.env("appiumUrl") || "http://127.0.0.1:4723";
}

// ── helpers ──────────────────────────────────────────────

/** Extract the W3C element ID from the response value */
function extractElementId(value) {
  return (
    value["element-6066-11e4-a52e-4f735466cecf"] ||
    value["ELEMENT"] ||
    value
  );
}

// ── Session management ───────────────────────────────────

/**
 * Create a new Appium session.
 * Stores the session id in Cypress.env('appiumSessionId').
 */
Cypress.Commands.add("appiumCreateSession", (caps) => {
  const body = {
    capabilities: {
      alwaysMatch: {
        platformName: caps.platformName || "Android",
        "appium:automationName": caps.automationName || "UiAutomator2",
        "appium:deviceName": caps.deviceName || "emulator-5554",
        "appium:appPackage": caps.appPackage,
        "appium:appActivity": caps.appActivity,
        "appium:noReset": caps.noReset !== undefined ? caps.noReset : true,
        "appium:newCommandTimeout": caps.newCommandTimeout || 600,
        "appium:forceAppLaunch":
          caps.forceAppLaunch !== undefined ? caps.forceAppLaunch : true,
      },
    },
  };

  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session`,
    body,
    timeout: 120000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    const sessionId = resp.body.value.sessionId;
    Cypress.env("appiumSessionId", sessionId);
    cy.log(`📱 Appium session: ${sessionId}`);
    return cy.wrap(resp.body.value, { log: false });
  });
});

/**
 * Delete / quit the current Appium session.
 */
Cypress.Commands.add("appiumDeleteSession", () => {
  const sid = Cypress.env("appiumSessionId");
  if (!sid) {
    return cy.wrap(null, { log: false });
  }

  cy.request({
    method: "DELETE",
    url: `${getAppiumBase()}/session/${sid}`,
    failOnStatusCode: false,
    timeout: 30000,
  }).then(() => {
    Cypress.env("appiumSessionId", null);
    return cy.wrap(null, { log: false });
  });
});

// ── Element interaction ──────────────────────────────────

/**
 * Find a SINGLE element.
 * @param {string} strategy  – 'id' | 'xpath' | 'accessibility id' | 'class name'
 * @param {string} selector  – locator value
 * @returns the element object { elementId, ... }
 */
Cypress.Commands.add("appiumFindElement", (strategy, selector) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/element`,
    body: { using: strategy, value: selector },
    timeout: 30000,
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status !== 200) {
      // Retry once after a short wait
      cy.wait(2000);
      cy.request({
        method: "POST",
        url: `${getAppiumBase()}/session/${sid}/element`,
        body: { using: strategy, value: selector },
        timeout: 30000,
      }).then((retryResp) => {
        expect(retryResp.status).to.eq(200);
        const elementId = extractElementId(retryResp.body.value);
        return cy.wrap({ elementId, raw: retryResp.body.value }, { log: false });
      });
    } else {
      const elementId = extractElementId(resp.body.value);
      return cy.wrap({ elementId, raw: resp.body.value }, { log: false });
    }
  });
});

/**
 * Find MULTIPLE elements.
 */
Cypress.Commands.add("appiumFindElements", (strategy, selector) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/elements`,
    body: { using: strategy, value: selector },
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    const elements = resp.body.value.map((v) => ({
      elementId: extractElementId(v),
      raw: v,
    }));
    return cy.wrap(elements, { log: false });
  });
});

/**
 * Tap / click an element.
 */
Cypress.Commands.add("appiumTap", (elementId) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/element/${elementId}/click`,
    body: {},
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(null, { log: false });
  });
});

/**
 * Send keystrokes / type text into an element.
 */
Cypress.Commands.add("appiumType", (elementId, text) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/element/${elementId}/value`,
    body: { text },
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(null, { log: false });
  });
});

/**
 * Clear an input element's text.
 */
Cypress.Commands.add("appiumClear", (elementId) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/element/${elementId}/clear`,
    body: {},
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
  });
});

/**
 * Get the text content of an element.
 */
Cypress.Commands.add("appiumGetText", (elementId) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "GET",
    url: `${getAppiumBase()}/session/${sid}/element/${elementId}/text`,
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(resp.body.value, { log: false });
  });
});

/**
 * Get an attribute value of an element.
 */
Cypress.Commands.add("appiumGetAttribute", (elementId, attrName) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "GET",
    url: `${getAppiumBase()}/session/${sid}/element/${elementId}/attribute/${attrName}`,
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(resp.body.value, { log: false });
  });
});

// ── Page / Screen helpers ────────────────────────────────

/**
 * Get the full page source XML.
 */
Cypress.Commands.add("appiumGetPageSource", () => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "GET",
    url: `${getAppiumBase()}/session/${sid}/source`,
    timeout: 60000,
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status !== 200) {
      return cy.wrap("", { log: false });
    }
    return cy.wrap(resp.body.value, { log: false });
  });
});

/**
 * Take a screenshot (base64).
 */
Cypress.Commands.add("appiumScreenshot", (filename) => {
  const sid = Cypress.env("appiumSessionId");
  if (!sid) {
    return cy.wrap(null, { log: false });
  }
  cy.request({
    method: "GET",
    url: `${getAppiumBase()}/session/${sid}/screenshot`,
    timeout: 30000,
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status !== 200 || !resp.body.value) {
      return cy.wrap(null, { log: false });
    }
    const base64 = resp.body.value;
    if (filename) {
      cy.writeFile(
        `cypress/screenshots/appium/${filename}.png`,
        base64,
        "base64"
      ).then(() => {
        return cy.wrap(base64, { log: false });
      });
    } else {
      return cy.wrap(base64, { log: false });
    }
  });
});

/**
 * Scroll (swipe) on the device screen.
 * @param {'up'|'down'} direction
 */
Cypress.Commands.add("appiumScroll", (direction = "down") => {
  const sid = Cypress.env("appiumSessionId");
  const startY = direction === "down" ? 1600 : 600;
  const endY = direction === "down" ? 600 : 1600;

  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/actions`,
    body: {
      actions: [
        {
          type: "pointer",
          id: "finger1",
          parameters: { pointerType: "touch" },
          actions: [
            { type: "pointerMove", duration: 0, x: 540, y: startY },
            { type: "pointerDown", button: 0 },
            { type: "pause", duration: 200 },
            { type: "pointerMove", duration: 500, x: 540, y: endY },
            { type: "pointerUp", button: 0 },
          ],
        },
      ],
    },
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(null, { log: false });
  });
});

/**
 * Activate / bring an app to foreground.
 */
Cypress.Commands.add("appiumActivateApp", (appId) => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/appium/device/activate_app`,
    body: { appId },
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(null, { log: false });
  });
});

/**
 * Hide the soft keyboard.
 */
Cypress.Commands.add("appiumHideKeyboard", () => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/appium/device/hide_keyboard`,
    body: {},
    failOnStatusCode: false,
    timeout: 10000,
  }).then(() => {
    return cy.wrap(null, { log: false });
  });
});

/**
 * Dismiss any Android system crash dialogs ("System UI isn't responding", etc.)
 * by tapping the "Wait" button if present, or pressing Back.
 */
Cypress.Commands.add("appiumDismissCrashDialogs", () => {
  const sid = Cypress.env("appiumSessionId");
  if (!sid) return cy.wrap(null, { log: false });

  // Try to find & tap the "Wait" button from ANR dialog
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/element`,
    body: { using: "id", value: "android:id/aerr_wait" },
    timeout: 5000,
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status === 200 && resp.body.value) {
      const elemId = extractElementId(resp.body.value);
      cy.log("⚠️  System crash dialog detected – tapping Wait");
      cy.request({
        method: "POST",
        url: `${getAppiumBase()}/session/${sid}/element/${elemId}/click`,
        body: {},
        timeout: 5000,
        failOnStatusCode: false,
      });
      cy.wait(2000);
      // Check if another dialog appeared and dismiss it too
      cy.request({
        method: "POST",
        url: `${getAppiumBase()}/session/${sid}/element`,
        body: { using: "id", value: "android:id/aerr_wait" },
        timeout: 3000,
        failOnStatusCode: false,
      }).then((resp2) => {
        if (resp2.status === 200 && resp2.body.value) {
          const elemId2 = extractElementId(resp2.body.value);
          cy.request({
            method: "POST",
            url: `${getAppiumBase()}/session/${sid}/element/${elemId2}/click`,
            body: {},
            timeout: 3000,
            failOnStatusCode: false,
          });
          cy.wait(1000);
        }
      });
    }
  });
});

/**
 * Press the device back button.
 */
Cypress.Commands.add("appiumBack", () => {
  const sid = Cypress.env("appiumSessionId");
  cy.request({
    method: "POST",
    url: `${getAppiumBase()}/session/${sid}/back`,
    body: {},
    timeout: 30000,
  }).then((resp) => {
    expect(resp.status).to.eq(200);
    return cy.wrap(null, { log: false });
  });
});
