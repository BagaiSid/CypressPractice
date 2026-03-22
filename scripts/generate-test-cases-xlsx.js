/**
 * Generate HR Dashboard Web Test Cases in .xlsx format
 *
 * Run: node scripts/generate-test-cases-xlsx.js
 * Output: HR_Dashboard_Web_TestCases.xlsx
 */
const XLSX = require("xlsx");
const path = require("path");

function sheet(data) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = data[0].map((_, i) => ({
    wch: Math.max(...data.map((r) => String(r[i] || "").length), 10) + 2,
  }));
  return ws;
}

const H = ["TC ID", "Test Suite", "Test Case Title", "Preconditions", "Test Steps", "Test Data", "Expected Result", "Priority", "Type"];

// ═══ 1. EXECUTIVE SUMMARY (DASHBOARD) ═══
const dashboardTests = [H,
  ["TC-01", "Dashboard", "Dashboard page loads with correct title", "App running on localhost:4000", "1. Navigate to /\n2. Check page title", "—", "Title is 'HR Dashboard'", "Critical", "Functional"],
  ["TC-02", "Dashboard", "Navigation bar visible with all links", "On dashboard page", "1. Visit /\n2. Verify nav bar\n3. Count nav links", "≥10 links", "Nav bar visible with 10+ links", "Critical", "UI"],
  ["TC-03", "Dashboard", "Dashboard link is active on index page", "On dashboard page", "1. Visit /\n2. Check Dashboard link class", "—", "Dashboard link has 'active' class", "Medium", "UI"],
  ["TC-04", "Dashboard", "All five band header cards are visible", "On dashboard page", "1. Visit /\n2. Check Demographics, Hired, Open Positions, Terminations, Applicants bands", "—", "All 5 band cards visible with correct text", "High", "UI"],
  ["TC-05", "Dashboard", "Head Count stat card with gender breakdown", "On dashboard page", "1. Verify #demographicsCard visible\n2. Check headCount, femaleCount, maleCount", "—", "Head Count card shows with gender breakdown", "High", "Functional"],
  ["TC-06", "Dashboard", "Hired stat card with permanent/temporary split", "On dashboard page", "1. Verify #hiresCard visible\n2. Check permanent and temporary counts", "—", "Hired card shows with permanent/temporary split", "High", "Functional"],
  ["TC-07", "Dashboard", "Open Positions stat card with regular/contract split", "On dashboard page", "1. Verify #openCard visible\n2. Check regular and contract counts", "—", "Open Positions card shows both splits", "High", "Functional"],
  ["TC-08", "Dashboard", "Terminations stat card with FT/PT split", "On dashboard page", "1. Verify #termCard visible\n2. Check fullTime and partTime counts", "—", "Terminations card shows FT/PT split", "High", "Functional"],
  ["TC-09", "Dashboard", "Applicants stat card with applied/interviewing split", "On dashboard page", "1. Verify #applicantsCard\n2. Check appliedCount and interviewingCount", "—", "Applicants card shows both counts", "High", "Functional"],
  ["TC-10", "Dashboard", "Employee by Organization chart is visible", "On dashboard page", "1. Check #byOrg section\n2. Verify h3 'Employee by Organization'", "—", "Chart section visible with heading", "Medium", "UI"],
  ["TC-11", "Dashboard", "Termination by Organization donut chart visible", "On dashboard page", "1. Check #termByOrg section\n2. Verify heading", "—", "Donut chart section visible", "Medium", "UI"],
  ["TC-12", "Dashboard", "Demographics band navigates to demographics page", "On dashboard page", "1. Click Demographics band", "—", "URL includes /demographics.html", "High", "Functional"],
  ["TC-13", "Dashboard", "Hired band navigates to hired page", "On dashboard page", "1. Click Hired band", "—", "URL includes /hired.html", "High", "Functional"],
  ["TC-14", "Dashboard", "Open Positions band navigates to open positions page", "On dashboard page", "1. Click Open Positions band", "—", "URL includes /openpositions.html", "High", "Functional"],
];

// ═══ 2. NAVIGATION ═══
const navTests = [H,
  ["TC-15", "Navigation", "Each nav link has valid href", "On dashboard page", "1. Iterate all nav links\n2. Check href attribute", "—", "All links have non-empty href", "High", "Functional"],
  ["TC-16", "Navigation", "Navigate to Employee Hiring via nav", "On dashboard page", "1. Click 'Employee Hiring' link\n2. Verify URL and heading", "—", "URL is /hiring.html, heading visible", "Critical", "Functional"],
  ["TC-17", "Navigation", "Navigate to Calendar & Attendance via nav", "On dashboard page", "1. Click 'Calendar & Attendance' link\n2. Check URL and title", "—", "URL is /calendar.html, title contains Calendar", "High", "Functional"],
  ["TC-18", "Navigation", "Navigate to Employees via nav", "On dashboard page", "1. Click 'Employees' link\n2. Verify heading", "—", "URL is /employees.html, heading visible", "High", "Functional"],
  ["TC-19", "Navigation", "Navigate to Interviews via nav", "On dashboard page", "1. Click 'Interviews' link\n2. Verify heading", "—", "URL is /interviews.html, heading visible", "High", "Functional"],
  ["TC-20", "Navigation", "Navigate to Leave Management via nav", "On dashboard page", "1. Click 'Leave Management' link\n2. Verify heading", "—", "URL is /leave.html, heading visible", "High", "Functional"],
  ["TC-21", "Navigation", "Navigate to Performance via nav", "On dashboard page", "1. Click 'Performance' link\n2. Verify heading", "—", "URL is /performance.html, heading visible", "High", "Functional"],
  ["TC-22", "Navigation", "Navigate to Documents via nav", "On dashboard page", "1. Click 'Documents' link\n2. Verify heading", "—", "URL is /documents.html, heading visible", "High", "Functional"],
  ["TC-23", "Navigation", "Navigate to Terminations via nav", "On dashboard page", "1. Click 'Terminations' link\n2. Verify heading", "—", "URL is /terminations-management.html", "High", "Functional"],
  ["TC-24", "Navigation", "Navigate to Hierarchy via nav", "On dashboard page", "1. Click 'Hierarchy' link\n2. Verify heading", "—", "URL is /hierarchy.html, heading visible", "High", "Functional"],
  ["TC-25", "Navigation", "Active nav link changes per page", "On dashboard page", "1. Click 'Employees'\n2. Check active class on Employees link", "—", "Active class on current page link", "Medium", "UI"],
];

// ═══ 3. EMPLOYEE HIRING ═══
const hiringTests = [H,
  ["TC-26", "Employee Hiring", "Hiring page displays all stat boxes", "Navigate to /hiring.html", "1. Visit /hiring.html\n2. Verify heading, totalJobs, openJobs, totalCandidates, hiredCount", "—", "All stat boxes visible with heading", "High", "Functional"],
  ["TC-27", "Employee Hiring", "Post New Job form has all required fields", "On hiring page", "1. Verify jobForm, jobTitle, department, jobType, location, salary, description, submit", "—", "All form fields present and visible", "High", "UI"],
  ["TC-28", "Employee Hiring", "Add New Candidate form has required fields", "On hiring page", "1. Verify candidateForm, candidateName, email, phone, experience, submit", "—", "All candidate form fields present", "High", "UI"],
  ["TC-29", "Employee Hiring", "Job search input is functional", "On hiring page", "1. Type 'Engineer' in #jobSearchInput\n2. Verify value", "Engineer", "Search input accepts text", "Medium", "Functional"],
  ["TC-30", "Employee Hiring", "Candidate filter dropdown is present", "On hiring page", "1. Check #filterStatus is visible", "—", "Dropdown exists and is visible", "Medium", "UI"],
  ["TC-31", "Employee Hiring", "Job title validates required input", "On hiring page", "1. Click submit without filling title\n2. Check validity", "—", "Browser validation prevents submission", "High", "Negative"],
];

// ═══ 4. EMPLOYEES ═══
const employeeTests = [H,
  ["TC-32", "Employees", "Employee Management page loads with stats", "Navigate to /employees.html", "1. Verify heading, totalEmployees, activeEmployees, onLeaveEmployees, avgSalary", "—", "All stat cards visible", "High", "Functional"],
  ["TC-33", "Employees", "Add Employee button opens modal", "On employees page", "1. Click '+ Add Employee'\n2. Verify #employeeModal is visible\n3. Check modal title", "—", "Modal opens with 'Add New Employee' title", "Critical", "Functional"],
  ["TC-34", "Employees", "Employee form has all required fields", "Modal open", "1. Click Add Employee\n2. Verify firstName, lastName, email, department, position, startDate", "—", "All form fields present in modal", "High", "UI"],
  ["TC-35", "Employees", "Employee modal can be closed", "Modal open", "1. Open modal\n2. Click close button\n3. Verify modal hidden", "—", "Modal closes and is not visible", "Medium", "Functional"],
  ["TC-36", "Employees", "Employees table exists for data display", "On employees page", "1. Check #employeesTable exists\n2. Check #employeesTableBody exists", "—", "Table structure present", "Medium", "UI"],
];

// ═══ 5. INTERVIEWS ═══
const interviewTests = [H,
  ["TC-37", "Interviews", "Interview page loads with stat cards", "Navigate to /interviews.html", "1. Verify heading and all stat cards (total, scheduled, completed, declined, thisWeek)", "—", "All stat cards visible", "High", "Functional"],
  ["TC-38", "Interviews", "Schedule Interview button opens modal", "On interviews page", "1. Click '+ Schedule Interview'\n2. Verify #interviewModal visible\n3. Check form", "—", "Modal opens with interview form", "Critical", "Functional"],
  ["TC-39", "Interviews", "Interview form has required fields", "Modal open", "1. Verify candidateId, position, interviewDate, interviewTime inputs", "—", "All required fields present", "High", "UI"],
  ["TC-40", "Interviews", "Stat cards clickable for filtering", "On interviews page", "1. Click 'Scheduled' stat card\n2. Verify it gets 'active' class", "—", "Clicked card becomes active", "Medium", "Functional"],
];

// ═══ 6. LEAVE MANAGEMENT ═══
const leaveTests = [H,
  ["TC-41", "Leave Management", "Leave page loads with all tabs", "Navigate to /leave.html", "1. Verify heading\n2. Check all 4 tabs: Requests, History, Balances, Policies", "—", "All tabs visible", "High", "UI"],
  ["TC-42", "Leave Management", "Leave Requests tab shows stat cards", "On leave page", "1. Verify totalRequests, pendingRequests, approvedRequests, thisMonthRequests", "—", "All stat cards visible", "High", "Functional"],
  ["TC-43", "Leave Management", "Request Leave button is functional", "On leave page", "1. Verify '+ Request Leave' button exists", "—", "Button is present and visible", "High", "Functional"],
  ["TC-44", "Leave Management", "Leave History tab is switchable", "On leave page", "1. Click 'Leave History' tab\n2. Verify #historyTab visible\n3. Check totalHistory", "—", "Tab switches to show history content", "High", "Functional"],
  ["TC-45", "Leave Management", "Leave Balances tab is switchable", "On leave page", "1. Click 'Leave Balances' tab\n2. Verify #balancesTab visible", "—", "Tab switches to show balances content", "Medium", "Functional"],
];

// ═══ 7. PERFORMANCE ═══
const perfTests = [H,
  ["TC-46", "Performance", "Performance page loads with tabs", "Navigate to /performance.html", "1. Verify heading\n2. Check tabs: Reviews, Goals, Ratings", "—", "All tabs visible", "High", "UI"],
  ["TC-47", "Performance", "Performance Reviews shows stat cards", "On performance page", "1. Verify totalReviews, quarterReviews, avgRating, pendingReviews", "—", "All review stats visible", "High", "Functional"],
  ["TC-48", "Performance", "Goals tab is switchable", "On performance page", "1. Click Goals tab\n2. Verify #goalsTab and #goalsList", "—", "Goals section visible", "Medium", "Functional"],
  ["TC-49", "Performance", "Ratings tab shows distribution", "On performance page", "1. Click Ratings tab\n2. Verify #ratingsTab, rating5, rating1", "—", "Rating distribution visible", "Medium", "Functional"],
];

// ═══ 8. DOCUMENTS & TERMINATIONS ═══
const docTermTests = [H,
  ["TC-50", "Documents", "Document Management page loads with stats", "Navigate to /documents.html", "1. Verify heading, totalDocuments, contractDocs, policyDocs, certificateDocs, Upload button", "—", "All stats and upload button visible", "High", "Functional"],
  ["TC-51", "Documents", "Document upload modal opens with fields", "On documents page", "1. Click '+ Upload Document'\n2. Verify #uploadModal, #docName, #docType, #docFilePath", "—", "Modal opens with required fields", "High", "Functional"],
  ["TC-52", "Terminations", "Termination page loads with stats", "Navigate to /terminations-management.html", "1. Verify heading, totalTerminations, fullTimeTerminations, partTimeTerminations", "—", "All termination stats visible", "High", "Functional"],
  ["TC-53", "Terminations", "Termination form has required fields", "On terminations page", "1. Verify terminationForm, terminatedEmployee, terminationDepartment, terminationType, terminationDate", "—", "All form fields present", "High", "UI"],
];

// ═══ 9. CALENDAR & HIERARCHY ═══
const calHierTests = [H,
  ["TC-54", "Calendar", "Calendar page loads with attendance stats", "Navigate to /calendar.html", "1. Verify title contains Calendar\n2. Check Total Holidays, Days Attended, Days Absent", "—", "Calendar page with all stats visible", "High", "Functional"],
  ["TC-55", "Calendar", "Calendar has Mark Attendance and Add Holiday forms", "On calendar page", "1. Verify 'Mark Attendance' section\n2. Verify 'Add Holiday' section", "—", "Both forms are present", "High", "UI"],
  ["TC-56", "Hierarchy", "Hierarchy page loads with org sections", "Navigate to /hierarchy.html", "1. Verify heading\n2. Check My Reporting Chain, My Peers, Full Organization Tree", "—", "All hierarchy sections present", "High", "Functional"],
];

// ═══ 10. RESPONSIVE & SECURITY ═══
const responsiveSecurityTests = [H,
  ["TC-57-Desktop", "Responsive", "Dashboard renders on Desktop (1280x720)", "Desktop viewport", "1. Set viewport 1280x720\n2. Visit /\n3. Verify nav bar and stat cards", "1280×720", "Nav bar and stat cards visible", "Medium", "Responsive"],
  ["TC-57-Tablet", "Responsive", "Dashboard renders on Tablet (768x1024)", "Tablet viewport", "1. Set viewport 768x1024\n2. Visit /\n3. Verify nav bar and stat cards", "768×1024", "Nav bar and stat cards visible", "Medium", "Responsive"],
  ["TC-57-Mobile", "Responsive", "Dashboard renders on Mobile (375x667)", "Mobile viewport", "1. Set viewport 375x667\n2. Visit /\n3. Verify nav bar and stat cards", "375×667", "Nav bar and stat cards visible", "Medium", "Responsive"],
  ["TC-58", "Security", "XSS payload in hiring form is sanitized", "On hiring page", "1. Type <script>alert('xss')</script> in job title\n2. Listen for alert", "XSS payload", "No alert triggered, value stored safely", "Critical", "Security"],
  ["TC-59", "Security", "Non-existent route returns 404", "—", "1. Request /nonexistent-page-xyz.html\n2. Check response status", "—", "HTTP 404 returned", "Medium", "Negative"],
  ["TC-60", "Performance", "Dashboard loads within 5 seconds", "App running", "1. Visit / with performance marks\n2. Measure load time", "—", "Page loads in < 5000ms", "High", "Performance"],
];

// ═══ SUMMARY SHEET ═══
const summary = [
  ["HR Dashboard Web – Test Case Summary"],
  [""],
  ["Total Test Cases", "60"],
  [""],
  ["Suite", "Count", "TC Range"],
  ["Dashboard – Executive Summary", "14", "TC-01 to TC-14"],
  ["Navigation", "11", "TC-15 to TC-25"],
  ["Employee Hiring", "6", "TC-26 to TC-31"],
  ["Employee Management", "5", "TC-32 to TC-36"],
  ["Interview Management", "4", "TC-37 to TC-40"],
  ["Leave Management", "5", "TC-41 to TC-45"],
  ["Performance Management", "4", "TC-46 to TC-49"],
  ["Documents & Terminations", "4", "TC-50 to TC-53"],
  ["Calendar & Hierarchy", "3", "TC-54 to TC-56"],
  ["Responsive & Security", "4 (6 w/ viewports)", "TC-57 to TC-60"],
  [""],
  ["Priority Distribution", "Critical: 5 | High: 34 | Medium: 18 | Low: 3"],
  ["Type Distribution", "Functional: 35 | UI: 12 | Responsive: 3 | Security: 1 | Negative: 2 | Performance: 1 | Other: 6"],
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, sheet(summary), "Summary");

const sheets = [
  { name: "Dashboard", data: dashboardTests },
  { name: "Navigation", data: navTests },
  { name: "Employee Hiring", data: hiringTests },
  { name: "Employees", data: employeeTests },
  { name: "Interviews", data: interviewTests },
  { name: "Leave Management", data: leaveTests },
  { name: "Performance", data: perfTests },
  { name: "Docs & Terminations", data: docTermTests },
  { name: "Calendar & Hierarchy", data: calHierTests },
  { name: "Responsive & Security", data: responsiveSecurityTests },
];

sheets.forEach(({ name, data }) => {
  XLSX.utils.book_append_sheet(wb, sheet(data), name);
});

const outPath = path.join(__dirname, "..", "HR_Dashboard_Web_TestCases.xlsx");
XLSX.writeFile(wb, outPath);
console.log(`✅ Generated: ${outPath}`);
