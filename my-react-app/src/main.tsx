// Import StrictMode - a tool that helps identify potential problems in your app
// It runs additional checks and warnings in development mode only
import { StrictMode } from 'react'

// Import createRoot - the way to render React apps (React 18+)
import { createRoot } from 'react-dom/client'

// Import global CSS styles that apply to the entire application
import './index.css'

// Import the main App component - this is the root of your component tree
import App from './App.tsx'

// This is the entry point of your React application
// 1. Find the HTML element with id="root" (defined in index.html)
// 2. Create a React root at that element
// 3. Render your App component inside StrictMode
// The "!" after getElementById tells TypeScript we're sure the element exists
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Your entire React application starts here with the App component */}
    <App />
  </StrictMode>,
)
