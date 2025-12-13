from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.orders import Order, OrderCreate, OrderPublic, OrderItem, OrderItemPublic
from app.models.products import Product
from app.routes.auth import get_current_user
from app.models.users import User

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=list[OrderPublic])
def list_my_orders(session: SessionDep, current_user: User = Depends(get_current_user)):
  orders = session.exec(
      select(Order).where(Order.user_id == current_user.id).order_by(Order.id.desc())
  ).all()

  # cargar items para cada order (simple y funciona)
  result: list[OrderPublic] = []
  for o in orders:
      items = session.exec(select(OrderItem).where(OrderItem.order_id == o.id)).all()
      public_items = [
          OrderItemPublic(
              id=i.id,
              product_id=i.product_id,
              unit_price_cents=i.unit_price_cents,
              quantity=i.quantity,
          )
          for i in items
      ]
      result.append(
          OrderPublic(
              id=o.id,
              user_id=o.user_id,
              status=o.status,
              total_cents=o.total_cents,
              currency=o.currency,
              created_at=o.created_at,
              items=public_items,
          )
      )
  return result


@router.post("/", response_model=OrderPublic, status_code=201)
def create_order(payload: OrderCreate, session: SessionDep, current_user: User = Depends(get_current_user)):
  if not payload.items or len(payload.items) == 0:
      raise HTTPException(status_code=400, detail="Empty order")

  # validar stock + calcular total
  total_cents = 0
  db_items: list[OrderItem] = []

  for item in payload.items:
      if item.quantity <= 0:
          raise HTTPException(status_code=400, detail="Quantity must be > 0")

      product = session.get(Product, item.product_id)
      if not product:
          raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

      if product.stock < item.quantity:
          raise HTTPException(
              status_code=400,
              detail=f"Insufficient stock for product {product.id}",
          )

      total_cents += product.price_cents * item.quantity
      db_items.append(
          OrderItem(
              product_id=product.id,
              unit_price_cents=product.price_cents,
              quantity=item.quantity,
          )
      )

  # crear order
  order = Order(
      user_id=current_user.id,
      status="created",
      total_cents=total_cents,
      currency=payload.currency,
  )
  session.add(order)
  session.commit()
  session.refresh(order)

  # crear order items + descontar stock
  created_items: list[OrderItemPublic] = []
  for db_item in db_items:
      db_item.order_id = order.id
      session.add(db_item)

      product = session.get(Product, db_item.product_id)
      product.stock -= db_item.quantity
      session.add(product)

  session.commit()

  items = session.exec(select(OrderItem).where(OrderItem.order_id == order.id)).all()
  for i in items:
      created_items.append(
          OrderItemPublic(
              id=i.id,
              product_id=i.product_id,
              unit_price_cents=i.unit_price_cents,
              quantity=i.quantity,
          )
      )

  return OrderPublic(
      id=order.id,
      user_id=order.user_id,
      status=order.status,
      total_cents=order.total_cents,
      currency=order.currency,
      created_at=order.created_at,
      items=created_items,
  )
