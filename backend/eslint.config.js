const js = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: "script", // for commonJS
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Integrate Prettier rules to disable conflicting ESLint rules
      "prettier/prettier": "error", // Ensure Prettier formatting issues are reported as ESLint errors
    },
  },
];
