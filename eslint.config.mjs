import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([".next/**", "dist/**", "backend/**", "node_modules/**"]),
  {
    ignores: [".next/**", "dist/**", "backend/**", "node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        console: "readonly",
        document: "readonly",
        fetch: "readonly",
        File: "readonly",
        FileReader: "readonly",
        FormData: "readonly",
        localStorage: "readonly",
        MouseEvent: "readonly",
        PopStateEvent: "readonly",
        process: "readonly",
        require: "readonly",
        RequestInit: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        URL: "readonly",
        window: "readonly",
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);
