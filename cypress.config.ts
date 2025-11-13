import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    defaultBrowser: "electron",
    setupNodeEvents(_config) {
      // make the configuration
    },
  },
});
