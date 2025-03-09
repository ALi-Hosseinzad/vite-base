import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    // js.configs.recommended, ...tseslint.configs.recommended
    extends: [],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // "react-hooks": reactHooks,
    // "react-refresh": reactRefresh,
    plugins: {},
    // ...reactHooks.configs.recommended.rules,
    // "react-refresh/only-export-components": [
    //   "warn",
    //   { allowConstantExport: true },
    // ],
    rules: {},
  }
);
