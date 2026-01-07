import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      // ✅ Prevent duplicate imports
      "no-duplicate-imports": "error",

      // ✅ Enforce curly braces for all blocks
      curly: ["error", "all"],

      // ✅ Warn on magic numbers
      "no-magic-numbers": [
        "error",
        {
          ignore: [0, 1],
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],

      "no-warning-comments": [
        "warn",
        { terms: ["todo", "fixme", "xxx"], location: "anywhere" },
      ],

      // ✅ Prevent empty arrow functions
      "no-empty-function": ["error", { allow: ["constructors"] }],

      // // ✅ Limit function size
      // "max-lines-per-function": [
      //   "warn",
      //   { max: 200, skipComments: true, skipBlankLines: true },
      // ],

      // ✅ Enforce naming convention (e.g., camelCase or UPPER_CASE for constants)
      "id-match": [
        "error",
        "^[_$A-Za-z][$A-Za-z0-9]*$|^[_$A-Z][_$A-Z0-9]+$",
        { properties: false, onlyDeclarations: true },
      ],

      // 🔄 Optional: disallow ternary (use if-else instead)
      // "no-ternary": "warn",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
]);
