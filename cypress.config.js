const { defineConfig } = require("cypress");
const browserify = require("@cypress/browserify-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  preprendTransformerToOptions,
} = require("@badeball/cypress-cucumber-preprocessor/browserify");

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    browserify(preprendTransformerToOptions(config, browserify.defaultOptions))
  );

  return config;
}

module.exports = defineConfig({
  projectId: "duf1he",
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 10000,
  reporter: "cypress-mochawesome-reporter",
  projectId: "duf1he",
  env: {
    url: "https://rahulshettyacademy.com",
    testUrl: "https://rahulshettyacademy.com/",
  },
  retries: {
    runMode: 3,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/integration/examples/BDD/*.feature",
    // specPattern: "cypress/integration/examples/*.js",
  },
});
