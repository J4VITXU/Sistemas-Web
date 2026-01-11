# E-commerce SPA – React + FastAPI

Full-stack e-commerce application built as a **Single Page Application (SPA)** with a **React + TypeScript + Vite** frontend and a **FastAPI + SQLModel + SQLite** backend.

The project includes product browsing, search, cart management, checkout with server-side validation, user authentication, and order history.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Fetch API
- JWT-based authentication

### Backend
- Python
- FastAPI
- SQLModel
- SQLite
- JWT (Bearer Token)
- OAuth2 Password Flow

---

## Project structure

- `frontend/react-router/` – React SPA
- `backend/` – FastAPI REST API

---

## Development setup

### Backend

From the `backend` directory:

```bash
fastapi dev app/main.py
```

### Optional: seed initial products
python seed_products.py

### Frontend
From the frontend/react-router directory:
  yarn dev

### Backend API configuration (frontend)

By default, the frontend communicates with the backend at:
  http://localhost:8000

The API base URL can be configured using the environment variable:
  VITE_API_BASE_URL=http://localhost:8000 yarn dev

Application features

- Product catalog
- Product search by text
- Product detail view with quantity selection
- Shopping cart with totals
- Checkout with server-side validation
- User registration and login
- JWT token handling
- Authenticated order history
- Client-side routing with React Router

### Routing (SPA)

The application uses React Router for client-side navigation.

Main routes include:
- Home (product listing)
- Product detail
- Cart
- Checkout
- Login
- Register
- Orders (authenticated users only)

### Authentication

Authentication is handled using JWT tokens.
- Tokens are stored in the browser
- Authenticated requests include the header:
  Authorization: Bearer <token>
- Protected routes require the user to be logged in

### Notes

The project is intended for local development and educational purposes.
The backend uses SQLite for simplicity.
Business logic and validation are handled server-side.
Frontend and backend are developed as independent applications.