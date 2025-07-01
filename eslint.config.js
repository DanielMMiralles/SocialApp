import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { globals: globals.browser },
    settings: {
      react: {
        version: "19.1",
        runtime: "automatic"
      }
    }
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    }
  }
];
