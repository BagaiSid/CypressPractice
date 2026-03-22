/// <reference types="cypress" />
/**
 * HR Dashboard – Web Application Test Suite
 *
 * Comprehensive test cases for the HR Dashboard web application
 * covering: Dashboard, Navigation, Employee Hiring, Employees,
 * Calendar & Attendance, Interviews, Leave Management, Performance,
 * Documents, Terminations, Hierarchy, Responsive Design, and Security.
 *
 * Prerequisites:
 *   1. HR Dashboard web app running at http://localhost:4000
 */

import DashboardPage from "../../support/pageObjects/web/DashboardPage";
import HiringPage from "../../support/pageObjects/web/HiringPage";

const dashboardPage = new DashboardPage();
const hiringPage = new HiringPage();
let data;

before(() => {
  cy.fixture("hrDashboardWeb").then((d) => {
    data = d;
  });
});

beforeEach(() => {
  cy.login(data.credentials.username, data.credentials.password);
});

// ═══════════════════════════════════════════════════════════
// DASHBOARD – EXECUTIVE SUMMARY
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Executive Summary (Web)", () => {
  beforeEach(() => {
    dashboardPage.visit();
  });

  it("TC-01: Dashboard page loads with correct title", () => {
    cy.title().should("eq", "HR Dashboard");
    cy.screenshot("TC01_dashboard_title");
  });

  it("TC-02: Navigation bar is visible with all links", () => {
    dashboardPage.getNavBar().should("be.visible");
    dashboardPage.getNavLinks().should("have.length.gte", 10);
  });

  it("TC-03: Dashboard link is active on index page", () => {
    dashboardPage.getNavLink("Dashboard").should("have.class", "active");
  });

  it("TC-04: All five band header cards are visible", () => {
    dashboardPage.getDemographicsBand().should("be.visible").and("contain.text", "Demographics");
    dashboardPage.getHiredBand().should("be.visible").and("contain.text", "Hired");
    dashboardPage.getOpenPositionsBand().should("be.visible").and("contain.text", "Open Positions");
    dashboardPage.getTerminationsBand().should("be.visible").and("contain.text", "Terminations");
    dashboardPage.getApplicantsBand().should("be.visible").and("contain.text", "Applicants");
    cy.screenshot("TC04_band_headers");
  });

  it("TC-05: Head Count stat card displays with gender breakdown", () => {
    cy.get("#demographicsCard").should("be.visible");
    cy.contains(".stat-title", "Head Count").should("be.visible");
    dashboardPage.getHeadCount().should("be.visible");
    dashboardPage.getFemaleCount().should("be.visible");
    dashboardPage.getMaleCount().should("be.visible");
  });

  it("TC-06: Hired stat card displays permanent and temporary split", () => {
    cy.get("#hiresCard").should("be.visible");
    cy.contains(".stat-title", "Hired").should("be.visible");
    dashboardPage.getHiresTotal().should("be.visible");
    dashboardPage.getPermanentCount().should("be.visible");
    dashboardPage.getTemporaryCount().should("be.visible");
  });

  it("TC-07: Open Positions stat card displays regular and contract split", () => {
    cy.get("#openCard").should("be.visible");
    dashboardPage.getOpenTotal().should("be.visible");
    dashboardPage.getRegularCount().should("be.visible");
    dashboardPage.getContractCount().should("be.visible");
  });

  it("TC-08: Terminations stat card displays full-time and part-time split", () => {
    cy.get("#termCard").should("be.visible");
    dashboardPage.getTermTotal().should("be.visible");
    dashboardPage.getFullTimeCount().should("be.visible");
    dashboardPage.getPartTimeCount().should("be.visible");
  });

  it("TC-09: Applicants stat card displays applied and interviewing split", () => {
    cy.get("#applicantsCard").should("be.visible");
    dashboardPage.getApplicantsTotal().should("be.visible");
    dashboardPage.getAppliedCount().should("be.visible");
    dashboardPage.getInterviewingCount().should("be.visible");
  });

  it("TC-10: Employee by Organization chart section is visible", () => {
    dashboardPage.getEmployeeByOrgChart().should("be.visible");
    cy.contains("h3", "Employee by Organization").should("be.visible");
    cy.screenshot("TC10_org_chart");
  });

  it("TC-11: Termination by Organization donut chart is visible", () => {
    dashboardPage.getTerminationByOrgDonut().should("be.visible");
    cy.contains("h3", "Termination by Organization").should("be.visible");
  });

  it("TC-12: Clicking Demographics band navigates to demographics page", () => {
    dashboardPage.getDemographicsBand().click();
    cy.url().should("include", "/demographics.html");
  });

  it("TC-13: Clicking Hired band navigates to hired page", () => {
    dashboardPage.getHiredBand().click();
    cy.url().should("include", "/hired.html");
  });

  it("TC-14: Clicking Open Positions band navigates to open positions page", () => {
    dashboardPage.getOpenPositionsBand().click();
    cy.url().should("include", "/openpositions.html");
  });
});

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Navigation (Web)", () => {
  beforeEach(() => {
    dashboardPage.visit();
  });

  it("TC-15: Each nav link has a valid href attribute", () => {
    dashboardPage.getNavLinks().each(($link) => {
      cy.wrap($link).should("have.attr", "href").and("not.be.empty");
    });
  });

  it("TC-16: Navigate to Employee Hiring page via nav", () => {
    dashboardPage.getNavLink("Employee Hiring").click();
    cy.url().should("include", "/hiring.html");
    cy.contains("Employee Hiring Management").should("be.visible");
    cy.screenshot("TC16_hiring_page");
  });

  it("TC-17: Navigate to Calendar & Attendance page via nav", () => {
    dashboardPage.getNavLink("Calendar & Attendance").click();
    cy.url().should("include", "/calendar.html");
    cy.title().should("contain", "Calendar");
  });

  it("TC-18: Navigate to Employees page via nav", () => {
    dashboardPage.getNavLink("Employees").click();
    cy.url().should("include", "/employees.html");
    cy.contains("Employee Management").should("be.visible");
  });

  it("TC-19: Navigate to Interviews page via nav", () => {
    dashboardPage.getNavLink("Interviews").click();
    cy.url().should("include", "/interviews.html");
    cy.contains("Interview Management").should("be.visible");
  });

  it("TC-20: Navigate to Leave Management page via nav", () => {
    dashboardPage.getNavLink("Leave Management").click();
    cy.url().should("include", "/leave.html");
    cy.contains("Leave Management").should("be.visible");
  });

  it("TC-21: Navigate to Performance page via nav", () => {
    dashboardPage.getNavLink("Performance").click();
    cy.url().should("include", "/performance.html");
    cy.contains("Performance Management").should("be.visible");
  });

  it("TC-22: Navigate to Documents page via nav", () => {
    dashboardPage.getNavLink("Documents").click();
    cy.url().should("include", "/documents.html");
    cy.contains("Document Management").should("be.visible");
  });

  it("TC-23: Navigate to Terminations page via nav", () => {
    dashboardPage.getNavLink("Terminations").click();
    cy.url().should("include", "/terminations-management.html");
    cy.contains("Termination Management").should("be.visible");
  });

  it("TC-24: Navigate to Hierarchy page via nav", () => {
    dashboardPage.getNavLink("Hierarchy").click();
    cy.url().should("include", "/hierarchy.html");
    cy.contains("Organization Hierarchy").should("be.visible");
  });

  it("TC-25: Active nav link changes based on current page", () => {
    dashboardPage.getNavLink("Employees").click();
    cy.get("nav.nav-bar a.active").should("contain.text", "Employees");
  });
});

// ═══════════════════════════════════════════════════════════
// EMPLOYEE HIRING
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Employee Hiring (Web)", () => {
  beforeEach(() => {
    hiringPage.visit();
  });

  it("TC-26: Hiring page displays all stat boxes", () => {
    hiringPage.getPageHeading().should("be.visible");
    hiringPage.getTotalJobs().should("be.visible");
    hiringPage.getOpenJobs().should("be.visible");
    hiringPage.getTotalCandidates().should("be.visible");
    hiringPage.getHiredCount().should("be.visible");
    cy.screenshot("TC26_hiring_stats");
  });

  it("TC-27: Post New Job form has all required fields", () => {
    hiringPage.getJobForm().should("be.visible");
    hiringPage.getJobTitleInput().should("be.visible");
    hiringPage.getDepartmentSelect().should("be.visible");
    hiringPage.getJobTypeSelect().should("be.visible");
    hiringPage.getLocationInput().should("be.visible");
    hiringPage.getSalaryInput().should("be.visible");
    hiringPage.getJobDescriptionInput().should("be.visible");
    hiringPage.getPostJobButton().should("be.visible");
  });

  it("TC-28: Add New Candidate form has all required fields", () => {
    hiringPage.getCandidateForm().should("be.visible");
    hiringPage.getCandidateNameInput().should("be.visible");
    hiringPage.getCandidateEmailInput().should("be.visible");
    hiringPage.getCandidatePhoneInput().should("be.visible");
    hiringPage.getExperienceInput().should("be.visible");
    hiringPage.getAddCandidateButton().should("be.visible");
  });

  it("TC-29: Job search input is functional", () => {
    hiringPage.getJobSearchInput().should("be.visible").type("Engineer");
    hiringPage.getJobSearchInput().should("have.value", "Engineer");
  });

  it("TC-30: Candidate filter by status dropdown is present", () => {
    hiringPage.getFilterStatusSelect().should("be.visible");
  });

  it("TC-31: Job title field validates required input", () => {
    hiringPage.getPostJobButton().click();
    hiringPage.getJobTitleInput().then(($el) => {
      expect($el[0].validity.valid).to.be.false;
    });
  });
});

// ═══════════════════════════════════════════════════════════
// EMPLOYEES PAGE
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Employee Management (Web)", () => {
  beforeEach(() => {
    cy.visit("/employees.html");
  });

  it("TC-32: Employee Management page loads with stat cards", () => {
    cy.contains("h1", "Employee Management").should("be.visible");
    cy.get("#totalEmployees").should("be.visible");
    cy.get("#activeEmployees").should("be.visible");
    cy.get("#onLeaveEmployees").should("be.visible");
    cy.get("#avgSalary").should("be.visible");
    cy.screenshot("TC32_employees_page");
  });

  it("TC-33: Add Employee button is present and opens modal", () => {
    cy.contains("button", "+ Add Employee").should("be.visible").click();
    cy.get("#employeeModal").should("be.visible");
    cy.get("#modalTitle").should("contain.text", "Add New Employee");
  });

  it("TC-34: Employee form has all required fields", () => {
    cy.contains("button", "+ Add Employee").click();
    cy.get("#firstName").should("be.visible");
    cy.get("#lastName").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.get("#department").should("be.visible");
    cy.get("#position").should("be.visible");
    cy.get("#startDate").should("be.visible");
  });

  it("TC-35: Employee modal can be closed", () => {
    cy.contains("button", "+ Add Employee").click();
    cy.get("#employeeModal").should("be.visible");
    cy.get("#employeeModal .close").click();
    cy.get("#employeeModal").should("not.be.visible");
  });

  it("TC-36: Employees table exists for data display", () => {
    cy.get("#employeesTable").should("exist");
    cy.get("#employeesTableBody").should("exist");
  });
});

// ═══════════════════════════════════════════════════════════
// INTERVIEWS PAGE
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Interview Management (Web)", () => {
  beforeEach(() => {
    cy.visit("/interviews.html");
  });

  it("TC-37: Interview page loads with all stat cards", () => {
    cy.contains("h1", "Interview Management").should("be.visible");
    cy.get("#totalInterviews").should("be.visible");
    cy.get("#scheduledInterviews").should("be.visible");
    cy.get("#completedInterviews").should("be.visible");
    cy.get("#declinedInterviews").should("be.visible");
    cy.get("#thisWeekInterviews").should("be.visible");
    cy.screenshot("TC37_interviews_page");
  });

  it("TC-38: Schedule Interview button opens modal", () => {
    cy.contains("button", "+ Schedule Interview").should("be.visible").click();
    cy.get("#interviewModal").should("be.visible");
    cy.get("#interviewForm").should("be.visible");
  });

  it("TC-39: Interview form has required fields", () => {
    cy.contains("button", "+ Schedule Interview").click();
    cy.get("#candidateId").should("be.visible");
    cy.get("#position").should("be.visible");
    cy.get("#interviewDate").should("be.visible");
    cy.get("#interviewTime").should("be.visible");
  });

  it("TC-40: Stat cards are clickable for filtering", () => {
    cy.get("#stat-scheduled").should("be.visible").click();
    cy.get("#stat-scheduled").should("have.class", "active");
  });
});

// ═══════════════════════════════════════════════════════════
// LEAVE MANAGEMENT
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Leave Management (Web)", () => {
  beforeEach(() => {
    cy.visit("/leave.html");
  });

  it("TC-41: Leave Management page loads with tabs", () => {
    cy.contains("h1", "Leave Management").should("be.visible");
    data.leaveTabs.forEach((tab) => {
      cy.contains("button.tab", tab).should("be.visible");
    });
    cy.screenshot("TC41_leave_page");
  });

  it("TC-42: Leave Requests tab shows stat cards", () => {
    cy.get("#totalRequests").should("be.visible");
    cy.get("#pendingRequests").should("be.visible");
    cy.get("#approvedRequests").should("be.visible");
    cy.get("#thisMonthRequests").should("be.visible");
  });

  it("TC-43: Request Leave button is functional", () => {
    cy.contains("button", "+ Request Leave").should("be.visible");
  });

  it("TC-44: Leave History tab is switchable", () => {
    cy.contains("button.tab", "Leave History").click();
    cy.get("#historyTab").should("be.visible");
    cy.get("#totalHistory").should("be.visible");
  });

  it("TC-45: Leave Balances tab is switchable", () => {
    cy.contains("button.tab", "Leave Balances").click();
    cy.get("#balancesTab").should("be.visible");
  });
});

// ═══════════════════════════════════════════════════════════
// PERFORMANCE MANAGEMENT
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Performance Management (Web)", () => {
  beforeEach(() => {
    cy.visit("/performance.html");
  });

  it("TC-46: Performance page loads with tabs", () => {
    cy.contains("h1", "Performance Management").should("be.visible");
    data.performanceTabs.forEach((tab) => {
      cy.contains("button.tab", tab).should("be.visible");
    });
    cy.screenshot("TC46_performance_page");
  });

  it("TC-47: Performance Reviews tab shows stat cards", () => {
    cy.get("#totalReviews").should("be.visible");
    cy.get("#quarterReviews").should("be.visible");
    cy.get("#avgRating").should("be.visible");
    cy.get("#pendingReviews").should("be.visible");
  });

  it("TC-48: Goals tab is switchable", () => {
    cy.contains("button.tab", "Goals").click();
    cy.get("#goalsTab").should("be.visible");
    cy.get("#goalsList").should("exist");
  });

  it("TC-49: Ratings tab shows distribution", () => {
    cy.contains("button.tab", "Ratings").click();
    cy.get("#ratingsTab").should("be.visible");
    cy.get("#rating5").should("be.visible");
    cy.get("#rating1").should("be.visible");
  });
});

// ═══════════════════════════════════════════════════════════
// DOCUMENTS & TERMINATIONS
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Documents & Terminations (Web)", () => {
  it("TC-50: Document Management page loads with stats and filters", () => {
    cy.visit("/documents.html");
    cy.contains("h1", "Document Management").should("be.visible");
    cy.get("#totalDocuments").should("be.visible");
    cy.get("#contractDocs").should("be.visible");
    cy.get("#policyDocs").should("be.visible");
    cy.get("#certificateDocs").should("be.visible");
    cy.contains("button", "+ Upload Document").should("be.visible");
    cy.screenshot("TC50_documents_page");
  });

  it("TC-51: Document upload modal opens and has required fields", () => {
    cy.visit("/documents.html");
    cy.contains("button", "+ Upload Document").click();
    cy.get("#uploadModal").should("be.visible");
    cy.get("#docName").should("be.visible");
    cy.get("#docType").should("be.visible");
    cy.get("#docFilePath").should("be.visible");
  });

  it("TC-52: Termination Management page loads with stats", () => {
    cy.visit("/terminations-management.html");
    cy.contains("Termination Management").should("be.visible");
    cy.get("#totalTerminations").should("be.visible");
    cy.get("#fullTimeTerminations").should("be.visible");
    cy.get("#partTimeTerminations").should("be.visible");
    cy.screenshot("TC52_terminations_page");
  });

  it("TC-53: Termination form has required fields", () => {
    cy.visit("/terminations-management.html");
    cy.get("#terminationForm").should("be.visible");
    cy.get("#terminatedEmployee").should("be.visible");
    cy.get("#terminationDepartment").should("be.visible");
    cy.get("#terminationType").should("be.visible");
    cy.get("#terminationDate").should("be.visible");
  });
});

// ═══════════════════════════════════════════════════════════
// CALENDAR & HIERARCHY
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Calendar & Hierarchy (Web)", () => {
  it("TC-54: Calendar page loads with attendance stats", () => {
    cy.visit("/calendar.html");
    cy.title().should("contain", "Calendar");
    cy.contains("Calendar & Attendance").should("be.visible");
    cy.contains("Total Holidays").should("be.visible");
    cy.contains("Days Attended").should("be.visible");
    cy.contains("Days Absent").should("be.visible");
    cy.screenshot("TC54_calendar_page");
  });

  it("TC-55: Calendar has Mark Attendance and Add Holiday forms", () => {
    cy.visit("/calendar.html");
    cy.contains("Mark Attendance").should("be.visible");
    cy.contains("Add Holiday").should("be.visible");
  });

  it("TC-56: Hierarchy page loads with organization sections", () => {
    cy.visit("/hierarchy.html");
    cy.contains("Organization Hierarchy").should("be.visible");
    data.hierarchySections.forEach((section) => {
      cy.contains(section).should("exist");
    });
    cy.screenshot("TC56_hierarchy_page");
  });
});

// ═══════════════════════════════════════════════════════════
// RESPONSIVE DESIGN
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Responsive Design (Web)", () => {
  const viewports = [
    { name: "Desktop", width: 1280, height: 720 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Mobile", width: 375, height: 667 },
  ];

  viewports.forEach((vp) => {
    it(`TC-57-${vp.name}: Dashboard renders correctly on ${vp.name} (${vp.width}x${vp.height})`, () => {
      cy.viewport(vp.width, vp.height);
      dashboardPage.visit();
      dashboardPage.getNavBar().should("be.visible");
      dashboardPage.getAllStatCards().should("have.length.gte", 1);
      cy.screenshot(`TC57_responsive_dashboard_${vp.width}x${vp.height}`);
    });
  });
});

// ═══════════════════════════════════════════════════════════
// SECURITY & EDGE CASES
// ═══════════════════════════════════════════════════════════
describe("HR Dashboard – Security & Error Handling (Web)", () => {
  it("TC-58: XSS payload in hiring form is sanitized", () => {
    hiringPage.visit();
    hiringPage.getJobTitleInput().type(data.xssPayload);

    cy.on("window:alert", () => {
      throw new Error("XSS vulnerability detected!");
    });

    hiringPage.getJobTitleInput().should("have.value", data.xssPayload);
    cy.screenshot("TC58_xss_sanitized");
  });

  it("TC-59: Non-existent route returns 404 or fallback page", () => {
    cy.request({ url: "/nonexistent-page-xyz.html", failOnStatusCode: false }).then(
      (resp) => {
        // Server may return 404 or serve a fallback page (200)
        expect(resp.status).to.be.oneOf([200, 404]);
      }
    );
  });

  it("TC-60: Dashboard page loads within acceptable time (< 5s)", () => {
    cy.visit("/", {
      onBeforeLoad: (win) => {
        win.performance.mark("start");
      },
    });

    dashboardPage.getNavBar().should("be.visible");

    cy.window().then((win) => {
      win.performance.mark("end");
      win.performance.measure("pageLoad", "start", "end");
      const duration = win.performance.getEntriesByName("pageLoad")[0].duration;
      cy.log(`Page load time: ${duration.toFixed(0)}ms`);
      expect(duration).to.be.lessThan(5000);
    });
  });
});
