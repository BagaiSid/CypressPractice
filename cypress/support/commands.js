// ***********************************************
// Custom Cypress Commands
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Appium mobile commands are defined in appiumCommands.js
// and imported via e2e.js support file.

// ── Secure fixture: loads & decrypts encrypted credentials ──
Cypress.Commands.add("secureFixture", (fixtureName) => {
  return cy.task("decryptFixture", { fixtureName });
});

// ── Web: Login via API and cache session ─────────────
Cypress.Commands.add("login", (username, password) => {
  cy.session(
    [username, password],
    () => {
      cy.request({
        method: "POST",
        url: "/api/login",
        body: { username, password },
      }).then((resp) => {
        const { token, refreshToken, user, isAdmin } = resp.body;
        window.sessionStorage.setItem("token", token);
        window.sessionStorage.setItem("refreshToken", refreshToken);
        window.sessionStorage.setItem("user", JSON.stringify(user));
        window.sessionStorage.setItem("username", user.username);
        window.sessionStorage.setItem("isAdmin", isAdmin ? "true" : "false");
        window.sessionStorage.setItem("designation", user.designation || "");
      });
    },
    {
      cacheAcrossSpecs: true,
    }
  );
});

// ── Web: Navigate to a specific page ────────────────
Cypress.Commands.add("visitPage", (pagePath) => {
  cy.visit(pagePath);
});

// ── Web: Assert navigation bar is visible ───────────
Cypress.Commands.add("assertNavBarVisible", () => {
  cy.get("nav.nav-bar").should("be.visible");
  cy.get("nav.nav-bar a").should("have.length.gte", 10);
});

// ── Web: Tab key (requires cypress-plugin-tab or native) ──
Cypress.Commands.add("tab", { prevSubject: "element" }, (subject) => {
  cy.wrap(subject).trigger("keydown", { keyCode: 9, which: 9, key: "Tab" });
});
