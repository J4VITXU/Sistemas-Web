from sqlmodel import Session, select
from app.db import engine
from app.models.products import Product


products_data = [
    {
        "title": "Laptop Pro 14",
        "slug": "laptop-pro-14",
        "description": "Powerful laptop for developers",
        "price_cents": 129999,
        "currency": "USD",
        "stock": 5,
    },
    {
        "title": "Wireless Mouse",
        "slug": "wireless-mouse",
        "description": "Ergonomic wireless mouse",
        "price_cents": 2999,
        "currency": "USD",
        "stock": 20,
    },
    {
        "title": "Mechanical Keyboard",
        "slug": "mechanical-keyboard",
        "description": "RGB mechanical keyboard",
        "price_cents": 8999,
        "currency": "USD",
        "stock": 10,
    },
    {
        "title": "USB-C Hub",
        "slug": "usb-c-hub",
        "description": "Multiport USB-C hub",
        "price_cents": 4999,
        "currency": "USD",
        "stock": 15,
    },
]


def seed_products():
    with Session(engine) as session:
        for data in products_data:
            exists = session.exec(
                select(Product).where(Product.slug == data["slug"])
            ).first()
            if exists:
                continue

            product = Product(**data)
            session.add(product)

        session.commit()


if __name__ == "__main__":
    seed_products()
    print("✅ Products seeded")
