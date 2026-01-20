# E-commerce SPA – React + FastAPI

## Project overview

This project is a **full‑stack e‑commerce web application** built as a **Single Page Application (SPA)**.
The frontend is developed with **React + TypeScript + Vite**, while the backend is a **REST API built with FastAPI**, **SQLModel**, and **SQLite**.

The application allows users to browse products, search the catalog, add items to a shopping cart, register and log in, validate checkout server‑side, and view their order history using JWT‑based authentication.

The project is intended for **educational purposes** and demonstrates a clean separation between frontend and backend, modern SPA routing, and secure API design.

---

## Live deployments

* **Frontend (SPA – Vercel):**
  [https://sistemas-web-git-main-javitxus-projects.vercel.app/](https://sistemas-web-git-main-javitxus-projects.vercel.app/)

* **Backend API (Render):**
  [https://zz-proyec2-backend.onrender.com](https://zz-proyec2-backend.onrender.com)

* **Backend API documentation (Swagger):**
  [https://zz-proyec2-backend.onrender.com/docs](https://zz-proyec2-backend.onrender.com/docs)

> Note: The backend is hosted on Render and may take a few seconds to respond on the first request due to cold start.

---

## Source repository

* **GitHub repository:**
  [https://github.com/J4VITXU/Sistemas-Web/tree/main/zz_proyec2](https://github.com/J4VITXU/Sistemas-Web/tree/main/zz_proyec2)

The repository contains both the backend and frontend source code, organized in a clear and logical structure.

---

## Project structure

```
zz_proyec2/
├── backend/                # FastAPI REST API
│   ├── app/
│   │   ├── routers/        # Auth, products, checkout, orders, health
│   │   ├── models/         # SQLModel database models
│   │   ├── core/           # Security, config, utilities
│   │   └── main.py         # FastAPI entry point
│   ├── seed_products.py    # Database seed script
│   └── pyproject.toml      # Backend dependencies
│
├── frontend/
│   └── react-router/       # React + Vite SPA
│       ├── src/
│       ├── package.json
│       ├── vite.config.ts
│       └── vercel.json     # SPA routing rewrites
│
└── README.md
```

---

## Tech stack

### Frontend

* React
* TypeScript
* Vite
* React Router (client‑side routing)
* Fetch API
* JWT‑based authentication

### Backend

* Python 3.11+
* FastAPI
* SQLModel
* SQLite
* JWT (Bearer Token)
* OAuth2 Password Flow

---

## Running the project locally

### Backend setup

From the `backend` directory:

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
fastapi dev app/main.py
```

The backend will be available at:

```
http://localhost:8000
```

### Database

* Database engine: SQLite
* Database file: `app/database.db`
* The database and tables are created automatically on startup using SQLModel

### Optional: seed initial products

```bash
python seed_products.py
```

The seed script:

* Inserts predefined products into the database
* Avoids duplicates using the `slug` field
* Can be executed multiple times safely

To fully reset the data:

```bash
rm app/database.db
fastapi dev app/main.py
python seed_products.py
```

---

### Frontend setup

From the `frontend/react-router` directory:

```bash
yarn install
yarn dev
```

The frontend will be available at:

```
http://localhost:5173
```

### Backend API configuration (frontend)

By default, the frontend connects to:

```
http://localhost:8000
```

You can override this using an environment variable:

```bash
VITE_API_BASE_URL=http://localhost:8000 yarn dev
```

---

## Application features

* Product catalog
* Product search by text
* Product detail view with quantity selection
* Shopping cart with totals
* Checkout with server‑side validation
* User registration and login
* JWT token handling
* Authenticated order history
* Client‑side routing with React Router

---

## Routing (SPA)

The frontend uses **React Router** for client‑side navigation. Navigation does not trigger full page reloads; instead, React components are re‑rendered dynamically.

Main routes include:

* `/` – Home / product listing
* `/product/:slug` – Product detail
* `/cart` – Shopping cart
* `/checkout` – Checkout
* `/login` – Login
* `/register` – User registration
* `/orders` – Order history (authenticated users only)

### Production routing (Vercel)

Because this is a SPA using `BrowserRouter`, routes such as `/cart` or `/orders` do not exist as physical files on the server.

To support page reloads and direct access, the project includes a `vercel.json` file that rewrites all incoming requests to `/`, allowing React Router to resolve the route correctly on the client side.

---

## Authentication

Authentication is implemented using **JWT (Bearer Tokens)**.

* Users register and log in via the backend API
* Tokens are stored in the browser
* Authenticated requests include the header:

```
Authorization: Bearer <token>
```

Protected routes and endpoints require a valid token.

### Demo user credentials

For testing purposes, a demo user is available:

* **Email:** [pepe@gmail.com](mailto:pepe@gmail.com)
* **Password:** 1234

---

## Backend API overview

### Health

* `GET /health` – API status check

### Authentication

* `POST /auth/register` – User registration
* `POST /auth/login` – User login (OAuth2 Password Flow)

### Products

* `GET /products` – Product list
* `GET /products?q=text` – Product search

### Checkout

* `POST /checkout/validate` – Validates cart and stock availability

### Orders

* `POST /orders` – Create an order (authenticated)
* `GET /orders` – Retrieve user order history (authenticated)

### Business logic highlights

* Server‑side stock validation
* Stock reduction on successful order creation
* Route protection using JWT
* Clear router separation (auth, products, checkout, orders, health)

---

## Design and architecture decisions

* **SPA architecture** was chosen to provide a smooth user experience without full page reloads.
* **FastAPI** was selected for its performance, automatic API documentation, and strong typing.
* **SQLModel + SQLite** provide a simple and readable persistence layer suitable for an educational project.
* **JWT authentication** enables stateless and secure API access.
* Frontend and backend are developed and deployed as **independent applications**, communicating via HTTP.

---

## Extensions beyond minimum requirements

* JWT‑based authentication
* Protected routes on both frontend and backend
* Order history per authenticated user
* Server‑side checkout validation
* SPA routing with production‑ready rewrites

---

## Notes

This project is designed for academic evaluation and learning purposes. It focuses on clarity, correctness, and modern full‑stack web development practices rather than production‑grade scalability.
