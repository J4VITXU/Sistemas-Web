// Import the defineConfig function from Vite
// This provides TypeScript autocomplete and type checking for your Vite configuration
import { defineConfig } from 'vite'

// Import the React plugin for Vite
// This plugin enables React-specific features like JSX transformation and Fast Refresh
import react from '@vitejs/plugin-react'

// Vite Configuration File
// Vite is a modern build tool that provides:
// - Fast development server with Hot Module Replacement (HMR)
// - Optimized production builds
// - Native ES modules support
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Configure the React plugin
    react({
      // Babel configuration for additional transformations
      babel: {
        plugins: [
          // React Compiler plugin - an experimental optimization that
          // automatically memoizes your components for better performance
          // It reduces unnecessary re-renders without manual optimization
          ['babel-plugin-react-compiler']
        ],
      },
    }),
  ],
})
