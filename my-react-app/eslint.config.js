// ESLint Configuration File
// ESLint is a tool that analyzes your code to find problems and enforce coding standards

// Import recommended JavaScript rules from ESLint
import js from '@eslint/js'

// Import globals definitions for different environments (browser, node, etc.)
import globals from 'globals'

// Import React Hooks plugin - enforces Rules of Hooks
// (hooks must be called in the same order, only at top level, etc.)
import reactHooks from 'eslint-plugin-react-hooks'

// Import React Refresh plugin - ensures your components work with Fast Refresh
// (warns if components aren't exported properly for hot reloading)
import reactRefresh from 'eslint-plugin-react-refresh'

// Import TypeScript ESLint - provides TypeScript-specific linting rules
import tseslint from 'typescript-eslint'

// Import config helpers
import { defineConfig, globalIgnores } from 'eslint/config'

// Export the ESLint configuration
export default defineConfig([
  // Ignore the 'dist' folder (your built/compiled code) from linting
  globalIgnores(['dist']),
  
  {
    // Apply these rules to all TypeScript files (.ts and .tsx)
    files: ['**/*.{ts,tsx}'],
    
    // Extend (inherit) configurations from multiple sources:
    extends: [
      js.configs.recommended,              // Basic JavaScript best practices
      tseslint.configs.recommended,        // TypeScript-specific rules
      reactHooks.configs.flat.recommended, // React Hooks rules
      reactRefresh.configs.vite,           // Vite Fast Refresh compatibility
    ],
    
    // Language options
    languageOptions: {
      ecmaVersion: 2020,        // Support modern JavaScript syntax (ES2020)
      globals: globals.browser, // Define browser globals (window, document, etc.)
    },
  },
])
