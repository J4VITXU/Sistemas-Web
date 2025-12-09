# React project learning guide

This guide explains every aspect of your React + TypeScript + Vite project to help you learn React development.

### What is React?

React is an open-source JavaScript library developed by Facebook for building user interfaces, especially those that require fast, interactive updates. Instead of thinking about manipulating the DOM directly, developers use React to describe **what the UI should look like at any given moment**, and React efficiently updates the browser when data changes. It’s particularly well-suited for building single-page applications where performance and seamless user interaction are important.

A core idea behind React is the **component-based architecture**. Components are reusable, independent pieces of UI that manage their own state and rendering logic. You can compose simple components to build more complex interfaces, making the code easier to maintain, debug, and scale. Each component follows a predictable lifecycle, and with React Hooks, developers can manage state and side effects in a clean and functional way.

React also uses a **virtual DOM**, one of its defining performance features. Instead of updating the real browser DOM directly (which is slow), React creates a lightweight copy of the DOM in memory. When something changes, React compares the virtual DOM with its previous version and applies only the minimal set of necessary updates to the real DOM. This process, known as **reconciliation**, makes updates both efficient and seamless.

Another key property of React is its **unidirectional data flow**, which means data moves from parent to child components. This makes the application’s data handling more predictable and easier to debug.

Key concepts:
- **Components**: Reusable pieces of UI (like LEGO blocks)
- **JSX**: HTML-like syntax in JavaScript
- **State**: Data that can change over time
- **Props**: Data passed from parent to child components
- **Hooks**: Special functions that let you use React features

### What is TypeScript?
TypeScript adds type checking to JavaScript. Benefits:
- Catches errors before runtime
- Better autocomplete in your editor
- Self-documenting code
- Easier refactoring

### What is Vite?
Vite is a modern build tool that:
- Provides instant server start
- Lightning-fast Hot Module Replacement (HMR)
- Optimized production builds
- Native ES modules support

## Project structure overview

```
my-react-app/
├── index.html              # Entry HTML file - where React mounts
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite build tool configuration
├── eslint.config.js        # Code quality/linting rules
├── tsconfig.json           # TypeScript project references
├── src/                    # Source code directory
│   ├── main.tsx           # Application entry point
│   ├── App.tsx            # Main App component
│   ├── App.css            # App component styles
│   ├── index.css          # Global styles
│   ├── assets/            # Images, SVGs, fonts imported in your code
│   ├── components/        # Reusable components go here
│   ├── pages/             # Page-level components go here
│   ├── hooks/             # Custom React hooks (reusable logic)
│   └── api/               # API calls and data fetching functions
└── public/                # Static assets (served as-is, not imported)
```

## Folder structure explained

### `src/assets/`
**Purpose:** Store images, SVGs, fonts, and other media that you **import** in your components.

**When to use:**
- Images referenced in JSX: `import logo from './assets/logo.png'`
- SVG files you import: `import icon from './assets/icon.svg'`
- Fonts loaded via CSS `@font-face`

**Benefits:**
- Files are processed by Vite (optimized, hashed for caching)
- TypeScript can type-check the imports
- Broken imports cause build errors (catch mistakes early)

**Example:**
```tsx
import logo from './assets/react.svg'
<img src={logo} alt="Logo" />
```

### `public/`
**Purpose:** Static files served **as-is** without processing.

**When to use:**
- Files referenced by absolute path: `/logo.png`
- Files that must keep their exact name (robots.txt, favicon.ico)
- Large files that shouldn't be bundled

**Difference from assets:**
- `public/` files: Not processed, keep original names
- `src/assets/` files: Optimized, hashed names for caching



### `src/components/`
**Purpose:** Reusable UI components used across multiple pages.

**Examples:**
- Button, Card, Modal, Navbar, Footer
- Form inputs (TextInput, Checkbox, etc.)
- Loading spinners, error messages

**Best Practice:** One component per file, with its own CSS if needed.

```tsx
// src/components/Button.tsx
export function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}
```

### `src/pages/`
**Purpose:** Page-level components that represent different routes/screens.

**Examples:**
- Home.tsx, About.tsx, Contact.tsx
- Dashboard.tsx, Profile.tsx, Settings.tsx

**Note:** Later you'll add React Router to navigate between these pages.

### `src/hooks/`
**Purpose:** Custom React hooks - reusable logic that can be shared across components.

**What are hooks?**
- Functions that start with "use" (e.g., useLocalStorage, useFetch)
- Extract component logic into reusable functions
- Can use other hooks (useState, useEffect, etc.)

**Example:**
```tsx
// src/hooks/useCounter.ts
import { useState } from 'react'

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset = () => setCount(initialValue)
  
  return { count, increment, decrement, reset }
}

// Usage in a component:
import { useCounter } from './hooks/useCounter'

function MyComponent() {
  const { count, increment } = useCounter(0)
  return <button onClick={increment}>Count: {count}</button>
}
```

**Common custom hooks:**
- `useLocalStorage` - Sync state with localStorage
- `useFetch` - Data fetching with loading/error states
- `useDebounce` - Delay rapid updates (e.g., search input)
- `useWindowSize` - Track window dimensions

### `src/api/`
**Purpose:** Centralize all API calls and data fetching logic.

**Why separate API calls?**
- Keep components clean and focused on UI
- Reuse API calls across multiple components
- Easy to mock for testing
- Single place to update endpoints

**Example:**
```tsx
// src/api/users.ts
const API_BASE = 'https://api.example.com'

export async function getUsers() {
  const response = await fetch(`${API_BASE}/users`)
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

export async function getUserById(id: string) {
  const response = await fetch(`${API_BASE}/users/${id}`)
  if (!response.ok) throw new Error('User not found')
  return response.json()
}

export async function createUser(userData: User) {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  return response.json()
}

// Usage in a component:
import { useEffect, useState } from 'react'
import { getUsers } from './api/users'

function UserList() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    getUsers().then(setUsers)
  }, [])
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```



## File-by-File Explanation

### `index.html`
The single HTML file for your app. React takes the `<div id="root">` and fills it with your entire application. This is called a Single Page Application (SPA).

### `src/main.tsx`
The JavaScript entry point. This file:
1. Finds the root element in HTML
2. Creates a React root
3. Renders your App component
4. Wraps it in StrictMode for development warnings

### `src/App.tsx`
Your first React component! Key parts:
- **useState Hook**: Manages the counter state
- **JSX Return**: Describes what to render
- **Event Handlers**: The onClick function
- **Component Export**: Makes it available to other files

### `src/index.css`
Global styles that apply everywhere:
- CSS custom properties (variables)
- Dark/light mode support
- Base element styling
- Responsive design

### `src/App.css`
Styles specific to the App component:
- Logo animations
- Card styling
- Hover effects

### `vite.config.ts`
Configures Vite's behavior:
- React plugin for JSX transformation
- React Compiler for automatic optimizations
- Build settings

### `eslint.config.js`
Linting rules to catch common mistakes:
- React Hooks rules (proper usage)
- TypeScript type checking
- Code quality standards

### `package.json`
Project metadata and dependencies:

**Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Check code quality
- `npm run preview` - Preview production build

You can also use yarn instead of npm

**Dependencies:**
- `react` - The React library
- `react-dom` - React's DOM rendering

**DevDependencies:**
- `vite` - Build tool
- `typescript` - Type checking
- `eslint` - Code quality tool
- Various type definitions and plugins



## Getting Started

1. **Install dependencies:**
   ```bash
   yarn/npm install
   ```

2. **Start development server:**
   ```bash
   yarn/npm run dev
   ```

3. **Open in browser:**
   - Usually `http://localhost:5173`
   - The URL will be shown in terminal

4. **Start coding:**
   - Edit `src/App.tsx`
   - Changes appear instantly (Hot Module Replacement)



## 📖 Resources

- [React Official Docs](https://react.dev) - Best place to learn
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Learn TypeScript
- [Vite Guide](https://vite.dev/guide/) - Understand your build tool
- [React DevTools](https://react.dev/learn/react-developer-tools) - Browser extension

