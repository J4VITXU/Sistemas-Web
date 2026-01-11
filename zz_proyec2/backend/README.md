# Backend – E-commerce API (FastAPI)

Backend of the e-commerce project built with **FastAPI**, **SQLModel**, and **SQLite**.  
It provides the REST API for products, authentication, checkout validation, and order management.

---

## Tech Stack

- Python
- FastAPI
- SQLModel
- SQLite
- JWT Authentication
- OAuth2 Password Flow

---

## Requirements

- Python 3.11 or higher
- Dependencies installed as defined in `pyproject.toml`

---

## Run locally

From the `backend` directory:

```bash
fastapi dev app/main.py
```

### Database

Database engine: SQLite
Database file: app/database.db
The database is created automatically on startup
Tables are generated at startup using SQLModel

### Initial product data (seed)

The initial product catalog is inserted using a seed script:

```bash
python seed_products.py
```

This script:

- Inserts predefined products into the SQLite database
- Prevents duplicates using the slug field
- Can be executed multiple times safely

Note: the seed script only inserts products if they do not already exist.
If a product with the same slug is already present in the database, it will not be updated.

To fully reset product stock and data, delete the database file and run the seed again:
```bash
rm app/database.db
fastapi dev app/main.py
python seed_products.py
```

### Authentication

The API uses JWT (Bearer Token) authentication.

Auth endpoints:

- POST /auth/register – User registration
- POST /auth/login – User login (OAuth2 Password Flow)

Protected endpoints require the following HTTP header:

Authorization: Bearer <token>

### Main endpoints
Health check
    GET /health
Returns the backend status.

Products
    GET /products
    GET /products?q=text (text search)

Checkout
    POST /checkout/validate
Validates cart contents and stock availability before order creation.

Orders
    POST /orders – Create an order (authentication required)
    GET /orders – Retrieve the authenticated user's order history

Business logic highlights

- Server-side stock validation
- Stock is reduced when an order is created
- Route protection using JWT
- Persistent storage with SQLite
- Clear router separation (auth, products, checkout, orders, health)

Environment variables (optional)
    SECRET_KEY – Key used to sign JWT tokens
        A default value is provided for development
        Recommended to override in production