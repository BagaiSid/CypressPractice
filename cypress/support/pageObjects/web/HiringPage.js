/**
 * Page Object: HR Dashboard – Hiring Page (Web)
 *
 * Covers the Employee Hiring page (/hiring.html) including
 * job posting form, candidate form, job listings, and candidate pipeline.
 */
class HiringPage {
  // ── Navigation ────────────────────────────────────────

  visit() {
    cy.visit("/hiring.html");
  }

  // ── Stat Boxes ────────────────────────────────────────

  getTotalJobs() {
    return cy.get("#totalJobs");
  }

  getOpenJobs() {
    return cy.get("#openJobs");
  }

  getTotalCandidates() {
    return cy.get("#totalCandidates");
  }

  getHiredCount() {
    return cy.get("#hiredCount");
  }

  getPageHeading() {
    return cy.contains("h1", "Employee Hiring Management");
  }

  // ── Post New Job Form ─────────────────────────────────

  getJobForm() {
    return cy.get("#jobForm");
  }

  getJobTitleInput() {
    return cy.get("#jobTitle");
  }

  getDepartmentSelect() {
    return cy.get("#department");
  }

  getJobTypeSelect() {
    return cy.get("#jobType");
  }

  getLocationInput() {
    return cy.get("#location");
  }

  getSalaryInput() {
    return cy.get("#salary");
  }

  getJobDescriptionInput() {
    return cy.get("#jobDescription");
  }

  getPostJobButton() {
    return cy.get("#jobForm button[type='submit']");
  }

  // ── Add New Candidate Form ────────────────────────────

  getCandidateForm() {
    return cy.get("#candidateForm");
  }

  getCandidateNameInput() {
    return cy.get("#candidateName");
  }

  getCandidateEmailInput() {
    return cy.get("#candidateForm #email");
  }

  getCandidatePhoneInput() {
    return cy.get("#candidateForm #phone");
  }

  getJobAppliedSelect() {
    return cy.get("#jobApplied");
  }

  getExperienceInput() {
    return cy.get("#experience");
  }

  getGenderSelect() {
    return cy.get("#candidateForm #gender");
  }

  getNotesInput() {
    return cy.get("#candidateForm #notes");
  }

  getAddCandidateButton() {
    return cy.get("#candidateForm button[type='submit']");
  }

  // ── Job Postings List ─────────────────────────────────

  getJobsList() {
    return cy.get("#jobsList");
  }

  getJobSearchInput() {
    return cy.get("#jobSearchInput");
  }

  // ── Candidates Pipeline ───────────────────────────────

  getCandidatesList() {
    return cy.get("#candidatesList");
  }

  getFilterStatusSelect() {
    return cy.get("#filterStatus");
  }

  getCandidateSearchInput() {
    return cy.get("#candidateSearchInput");
  }

  // ── Actions ───────────────────────────────────────────

  postJob(job) {
    this.getJobTitleInput().clear().type(job.title);
    this.getDepartmentSelect().select(job.department);
    this.getJobTypeSelect().select(job.type);
    if (job.location) this.getLocationInput().clear().type(job.location);
    if (job.salary) this.getSalaryInput().clear().type(job.salary);
    if (job.description) this.getJobDescriptionInput().clear().type(job.description);
    this.getPostJobButton().click();
  }

  addCandidate(candidate) {
    this.getCandidateNameInput().clear().type(candidate.name);
    this.getCandidateEmailInput().clear().type(candidate.email);
    if (candidate.phone) this.getCandidatePhoneInput().clear().type(candidate.phone);
    if (candidate.experience) this.getExperienceInput().clear().type(candidate.experience);
    this.getAddCandidateButton().click();
  }
}

export default HiringPage;
