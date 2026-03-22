/**
 * Page Object: HR Dashboard – Login Page
 *
 * Mirrors the same Page Object pattern used in HomePage.js / ShopPage.js
 * but targets mobile elements via Appium custom commands.
 */
class LoginPage {
  /** The "Username" input field */
  getUsernameField() {
    return cy.appiumFindElement(
      "xpath",
      '//android.widget.EditText[@hint="Enter your username"]'
    );
  }

  /** The "Password" input field */
  getPasswordField() {
    return cy.appiumFindElement(
      "xpath",
      '//android.widget.EditText[@password="true"]'
    );
  }

  /** The "Login" button */
  getLoginButton() {
    return cy.appiumFindElement("accessibility id", "Login");
  }

  /** The "Forgot your password?" link */
  getForgotPasswordLink() {
    return cy.appiumFindElement("accessibility id", "Forgot your password?");
  }

  /** Page title – "HR Dashboard" */
  getPageTitle() {
    return cy.appiumFindElement(
      "xpath",
      '//*[contains(@text, "HR Dashboard")]'
    );
  }

  /** Subtitle – "Employee Hiring & Management System" */
  getSubtitle() {
    return cy.appiumFindElement(
      "xpath",
      '//*[contains(@text, "Employee Hiring")]'
    );
  }

  /** Demo hint text */
  getDemoHint() {
    return cy.appiumFindElement(
      "xpath",
      '//*[contains(@text, "Demo: Admin")]'
    );
  }

  // ── Convenience actions ───────────────────────────────

  /**
   * Perform login with given credentials.
   * @param {string} username
   * @param {string} password
   */
  login(username, password) {
    this.getUsernameField().then(({ elementId }) => {
      cy.appiumTap(elementId);
      cy.appiumType(elementId, username);
    });

    this.getPasswordField().then(({ elementId }) => {
      cy.appiumTap(elementId);
      cy.appiumType(elementId, password);
    });

    // Hide keyboard so Login button is visible
    cy.appiumHideKeyboard();
    cy.wait(500);

    this.getLoginButton().then(({ elementId }) => {
      cy.appiumTap(elementId);
    });
  }
}

export default LoginPage;
