/**
 * Page Object: HR Dashboard – Dashboard Page (after login)
 *
 * This page object discovers the dashboard screen elements
 * and provides helper methods to interact with them.
 */
class DashboardPage {
  /** Verify we landed on the dashboard by looking for common dashboard elements */
  verifyDashboardLoaded() {
    return cy.appiumGetPageSource().then((source) => {
      // The dashboard should no longer show the Login button as the main action
      expect(source).to.not.include('text="Enter your username"');
      cy.log("✅ Dashboard screen loaded");
      return cy.wrap(source);
    });
  }

  /** Get all visible text elements on the dashboard */
  getAllTextElements() {
    return cy.appiumFindElements(
      "xpath",
      '//*[@text!="" and string-length(@text) > 0]'
    );
  }

  /** Take a screenshot of the current dashboard screen */
  screenshotDashboard(name = "dashboard") {
    return cy.appiumScreenshot(name);
  }

  /** Navigate back to login (or previous screen) */
  goBack() {
    return cy.appiumBack();
  }

  /** Scroll down to see more dashboard content */
  scrollDown() {
    return cy.appiumScroll("down");
  }

  /** Scroll up */
  scrollUp() {
    return cy.appiumScroll("up");
  }
}

export default DashboardPage;
