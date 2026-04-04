import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "my-app/**",
  ]),
  {
    files: ["app/**/*.{js,jsx,ts,tsx}", "lib/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}", "*.{js,jsx,ts,tsx,mjs}"],
  },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;