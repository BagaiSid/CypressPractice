# HR Dashboard – Test Automation Suite

End-to-end test automation framework for the **HR Dashboard** application, covering both **Web** (Cypress) and **Mobile** (Cypress + Appium) platforms. Built with the **Page Object Model** pattern, fixture-driven test data, encrypted credentials, and integrated reporting.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Page Objects](#page-objects)
- [Custom Commands](#custom-commands)
- [Credential Encryption](#credential-encryption)
- [Test Reporting](#test-reporting)
- [Excel Test Case Report](#excel-test-case-report)
- [Configuration](#configuration)

---

## Project Overview

The HR Dashboard is an Employee Hiring & Management System with 10+ pages including Executive Summary, Employee Hiring, Calendar & Attendance, Employees, Interviews, Leave Management, Performance, Documents, Terminations, and Organization Hierarchy.

This test suite provides **62 automated web test cases** and **10 mobile test cases** organized across multiple modules, validating UI elements, navigation, forms, modals, tabs, responsive design, and security.

---

## Tech Stack

| Technology         | Version  | Purpose                                      |
| ------------------ | -------- | -------------------------------------------- |
| Cypress            | 15.12.0  | E2E test framework (web & mobile)            |
| Appium             | 2.x      | Mobile automation server                     |
| UiAutomator2       | latest   | Android automation driver                    |
| Node.js            | 25.x     | Runtime environment                          |
| dotenv             | 17.3.1   | Environment variable management              |
| xlsx (SheetJS)     | 0.18.5   | Excel test case report generation            |
| mochawesome        | 3.8.2    | HTML/JSON test reports                       |
| AES-256-GCM        | built-in | Credential encryption (Node.js crypto)       |

---

## Project Structure

```
CypressPractice/
├── cypress.config.js                          # Cypress configuration (web + mobile)
├── package.json                               # Dependencies and npm scripts
├── .env.example                               # Environment variable template
├── .gitignore                                 # Git ignore rules
├── HR_Dashboard_Web_TestCases.xlsx            # Generated Excel test case report
│
├── cypress/
│   ├── fixtures/
│   │   ├── hrDashboardWeb.json                # Web test data (credentials, pages, stats)
│   │   └── hrDashboard.json                   # Mobile test data (encrypted credentials)
│   │
│   ├── integration/examples/
│   │   ├── HRDashboardWeb.js                  # Web test spec (62 tests)
│   │   └── HRDashboardMobile.js               # Mobile test spec (10 tests)
│   │
│   ├── support/
│   │   ├── commands.js                        # Custom web commands (login, navigation)
│   │   ├── appiumCommands.js                  # Custom Appium commands (tap, type, scroll)
│   │   ├── crypto.js                          # AES-256-GCM encryption/decryption utility
│   │   ├── e2e.js                             # Support file loader
│   │   └── pageObjects/
│   │       ├── web/
│   │       │   ├── DashboardPage.js           # Executive Summary page object
│   │       │   └── HiringPage.js              # Employee Hiring page object
│   │       └── mobile/
│   │           ├── LoginPage.js               # Mobile login page object
│   │           └── DashboardPage.js           # Mobile dashboard page object
│   │
│   ├── reports/html/                          # Mochawesome HTML reports
│   └── screenshots/                           # Test failure screenshots
│
└── scripts/
    ├── start-mobile-env.sh                    # Android emulator + Appium startup
    ├── generate-test-cases-xlsx.js            # Excel report generator
    └── encrypt-credentials.js                 # Credential encryption script
```

---

## Prerequisites

- **Node.js** >= 18
- **HR Dashboard web app** running at `http://localhost:4000`
- For mobile tests:
  - **Android Studio** with an AVD (default: `Medium_Phone_API_36.1`)
  - **Appium** 2.x installed globally (`npm install -g appium`)
  - **UiAutomator2 driver** (`appium driver install uiautomator2`)
  - **ANDROID_HOME** environment variable set

---

## Installation

```bash
git clone <repository-url>
cd CypressPractice
npm install
```

---

## Environment Setup

1. **Create the environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Set the encryption key** in `.env`:

   ```
   CREDENTIALS_KEY=your-secret-key-here
   ```

3. **Start the HR Dashboard app** on port 4000 (separate terminal).

4. **For mobile tests**, boot the Android emulator:

   ```bash
   npm run mobile:env
   ```

---

## Running Tests

### Web Tests

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run web`        | Run all 62 web tests in headless Electron    |
| `npm run web:open`   | Open Cypress interactive mode for web tests  |
| `npm run web:chrome` | Run web tests in headless Chrome             |

### Mobile Tests

| Command               | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run mobile`      | Run all 10 mobile tests (emulator must be running) |
| `npm run mobile:open` | Open Cypress interactive mode for mobile tests     |
| `npm run mobile:env`  | Start emulator + Appium, then run mobile tests     |

### All Tests

```bash
npm test          # Headless (all specs)
npm run headtest  # Headed mode (all specs)
```

---

## Test Coverage

### Web Test Suite – 62 Tests

| Module                        | Test Cases   | Coverage                                                  |
| ----------------------------- | ------------ | --------------------------------------------------------- |
| Executive Summary (Dashboard) | TC-01 – TC-14 | Page load, nav bar, band cards, stat cards, charts, navigation clicks |
| Navigation                    | TC-15 – TC-25 | All 10 nav links, href validation, active state tracking  |
| Employee Hiring               | TC-26 – TC-31 | Stat boxes, job form, candidate form, search, validation  |
| Employee Management           | TC-32 – TC-36 | Stat cards, modal open/close, form fields, table          |
| Interview Management          | TC-37 – TC-40 | Stat cards, schedule modal, form fields, filtering        |
| Leave Management              | TC-41 – TC-45 | Tabs, stat cards, request button, tab switching           |
| Performance Management        | TC-46 – TC-49 | Tabs, stat cards, goals list, rating distribution         |
| Documents & Terminations      | TC-50 – TC-53 | Stats, upload modal, termination form, filters            |
| Calendar & Hierarchy          | TC-54 – TC-56 | Attendance stats, forms, org hierarchy sections           |
| Responsive Design             | TC-57 (×3)   | Desktop (1280×720), Tablet (768×1024), Mobile (375×667)   |
| Security & Error Handling     | TC-58 – TC-60 | XSS sanitization, 404 handling, page load performance     |

### Mobile Test Suite – 10 Tests

| Module     | Test Cases   | Coverage                                                      |
| ---------- | ------------ | ------------------------------------------------------------- |
| Login      | TC-01 – TC-07 | UI elements, valid/invalid login, input masking, scroll, page source |
| Dashboard  | TC-08 – TC-10 | Dashboard exploration, forgot password link, app package verification |

---

## Page Objects

### Web

- **DashboardPage** – Executive Summary page (`index.html`): nav bar, band headers, stat cards (Head Count, Hired, Open Positions, Terminations, Applicants), org charts, donut charts
- **HiringPage** – Employee Hiring page (`hiring.html`): stat boxes, Post New Job form, Add Candidate form, job search, status filters

### Mobile

- **LoginPage** – Login screen: username/password fields, login button, forgot password link
- **DashboardPage** – Dashboard screen: navigation, menu items

---

## Custom Commands

### Web Commands

| Command                              | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| `cy.login(username, password)`       | API-based login with `cy.session()` caching        |
| `cy.secureFixture(fixtureName)`      | Load and decrypt encrypted fixture data            |
| `cy.visitPage(pagePath)`             | Navigate to a page path                            |
| `cy.assertNavBarVisible()`           | Assert nav bar visible with ≥10 links              |
| `cy.tab()`                           | Simulate Tab key press (chained from element)      |

### Mobile Commands (Appium)

| Command                                      | Description                          |
| -------------------------------------------- | ------------------------------------ |
| `cy.appiumCreateSession(capabilities)`       | Create Appium session                |
| `cy.appiumDeleteSession()`                   | End Appium session                   |
| `cy.appiumFindElement(strategy, selector)`   | Find element by xpath/id/class       |
| `cy.appiumFindElements(strategy, selector)`  | Find multiple elements               |
| `cy.appiumTap(elementId)`                    | Tap an element                       |
| `cy.appiumType(elementId, text)`             | Type text into input                 |
| `cy.appiumClear(elementId)`                  | Clear input field                    |
| `cy.appiumGetText(elementId)`                | Get element text                     |
| `cy.appiumGetAttribute(elementId, attrName)` | Get element attribute                |
| `cy.appiumGetPageSource()`                   | Get full page source XML             |
| `cy.appiumScreenshot(filename)`              | Capture and save screenshot as PNG   |
| `cy.appiumScroll(direction)`                 | Scroll up or down via touch swipe    |

---

## Credential Encryption

Sensitive credentials are encrypted with **AES-256-GCM** to allow safe storage in version control.

**Format:** `enc:<iv>:<authTag>:<ciphertext>` (all hex-encoded)

### Encrypt credentials

```bash
node scripts/encrypt-credentials.js
```

This encrypts all string values in fixture files using the key from `CREDENTIALS_KEY` in `.env`.

### How it works

1. The decryption key is stored in `.env` (git-ignored)
2. `crypto.js` derives a 32-byte key via SHA-256 hash of the passphrase
3. `cy.secureFixture()` command calls the `decryptFixture` Cypress task
4. The task recursively decrypts all `enc:...` prefixed values in the fixture

---

## Test Reporting

Reports are generated automatically using **cypress-mochawesome-reporter**.

- **HTML reports:** `cypress/reports/html/`
- **JSON reports:** `cypress/reports/html/.jsons/`
- **Screenshots:** `cypress/screenshots/` (captured on test failure and via `cy.screenshot()`)

---

## Excel Test Case Report

A detailed test case spreadsheet is available at `HR_Dashboard_Web_TestCases.xlsx`.

### Regenerate the report

```bash
node scripts/generate-test-cases-xlsx.js
```

The generated Excel file contains sheets for each module with columns: TC ID, Test Suite, Test Case Title, Preconditions, Test Steps, Test Data, Expected Result, Priority, and Type.

---

## Configuration

### `cypress.config.js` highlights

- **baseUrl:** `http://localhost:4000` (configurable)
- **Spec pattern:** `cypress/integration/examples/*.js`
- **Retries:** 1 in run mode, 0 in open mode
- **Auto-start:** Android emulator and Appium server auto-detected and launched if needed
- **Encryption task:** `decryptFixture` registered for secure fixture loading
- **Environment variables:**
  - `AVD_NAME` – Android Virtual Device name (default: `Medium_Phone_API_36.1`)
  - `APPIUM_PORT` – Appium server port (default: `4723`)
  - `CREDENTIALS_KEY` – Encryption key for fixture credentials

---

## Author

**Sid**

## License

ISC
