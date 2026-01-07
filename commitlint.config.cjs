const ERROR_LEVEL = 2;

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      ERROR_LEVEL,
      "always",
      [
        "feat", // New feature (UI, UX, functionality)
        "fix", // Bug fix (JS, logic, etc.)
        "style", // CSS/styling changes (no logic)
        "refactor", // Code improvement (no functionality change)
        "docs", // Documentation (README, JSDoc, etc.)
        "test", // Adding/changing tests
        "chore", // Tooling, config, build (e.g., eslint, husky)
        "perf", // Performance improvement (lazy loading, etc.)
        "ci", // CI-related changes (GitHub Actions, etc.)
        "build", // Build-related changes (Vite, Webpack, etc.)
        "revert", // Reverts a previous commit
        "ui", // UI-only changes (e.g., spacing, icons, layout)
        "deps", // Dependency updates (e.g., npm, yarn)
      ],
    ],
    "subject-case": [0],
  },
};
