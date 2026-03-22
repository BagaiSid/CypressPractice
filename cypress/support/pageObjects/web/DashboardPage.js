/**
 * Page Object: HR Dashboard – Executive Summary Page (Web)
 *
 * Covers the main dashboard (index.html) with stat cards,
 * charts, navigation bar, and the executive summary sections.
 */
class DashboardPage {
  // ── Navigation ────────────────────────────────────────

  visit() {
    cy.visit("/");
  }

  getNavBar() {
    return cy.get("nav.nav-bar");
  }

  getNavLinks() {
    return cy.get("nav.nav-bar a");
  }

  getNavLink(text) {
    return cy.get("nav.nav-bar").contains("a", text);
  }

  // ── Page Title ────────────────────────────────────────

  getPageTitle() {
    return cy.title();
  }

  // ── Band Headers (clickable summary cards) ────────────

  getDemographicsBand() {
    return cy.get("section.card.band.demographic");
  }

  getHiredBand() {
    return cy.get("section.card.band.hires");
  }

  getOpenPositionsBand() {
    return cy.get("section.card.band.openpos");
  }

  getTerminationsBand() {
    return cy.get("section.card.band.terminations");
  }

  getApplicantsBand() {
    return cy.get("section.card.band.applicants");
  }

  // ── Stat Cards ────────────────────────────────────────

  getHeadCount() {
    return cy.get("#headCount");
  }

  getFemaleCount() {
    return cy.get("#femaleCount");
  }

  getMaleCount() {
    return cy.get("#maleCount");
  }

  getHiresTotal() {
    return cy.get("#hiresTotal");
  }

  getPermanentCount() {
    return cy.get("#permanent");
  }

  getTemporaryCount() {
    return cy.get("#temporary");
  }

  getOpenTotal() {
    return cy.get("#openTotal");
  }

  getRegularCount() {
    return cy.get("#regular");
  }

  getContractCount() {
    return cy.get("#contract");
  }

  getTermTotal() {
    return cy.get("#termTotal");
  }

  getFullTimeCount() {
    return cy.get("#fullTime");
  }

  getPartTimeCount() {
    return cy.get("#partTime");
  }

  getApplicantsTotal() {
    return cy.get("#applicantsTotal");
  }

  getAppliedCount() {
    return cy.get("#appliedCount");
  }

  getInterviewingCount() {
    return cy.get("#interviewingCount");
  }

  // ── Charts ────────────────────────────────────────────

  getEmployeeByOrgChart() {
    return cy.get("#byOrg");
  }

  getTerminationByOrgDonut() {
    return cy.get("#termByOrg");
  }

  getOrgBars() {
    return cy.get("#orgBars");
  }

  getDonut() {
    return cy.get("#donut");
  }

  getDonutLegend() {
    return cy.get("#donutLegend");
  }

  // ── All Stat Cards (generic) ──────────────────────────

  getAllStatCards() {
    return cy.get("section.card.stat");
  }

  getAllCards() {
    return cy.get("section.card");
  }

  // ── Executive Summary Sections ────────────────────────

  getExecSummaryData() {
    return cy.get("#execSummaryData");
  }

  getExecSummaryRestricted() {
    return cy.get("#execSummaryRestricted");
  }
}

export default DashboardPage;
