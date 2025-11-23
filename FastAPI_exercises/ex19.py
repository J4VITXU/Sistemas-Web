import os
import time
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

LOG_FILE = "notify.log"  # como el ejercicio 15


def test_16_middleware_header_present_on_ping():
    r = client.get("/ping")
    assert r.status_code == 200
    # El middleware debe añadir siempre esta cabecera con un float positivo
    assert "X-Process-Time" in r.headers
    # Comprobar que es convertible a float y > 0
    val = float(r.headers["X-Process-Time"])
    assert val >= 0.0


def test_15_notify_background_side_effect():
    # Limpieza previa del log
    if os.path.exists(LOG_FILE):
        os.remove(LOG_FILE)

    r = client.post("/notify", params={"message": "Hola Carmen"})
    assert r.status_code == 200
    assert r.json() == {"status": "queued"}

    # Dar tiempo a la tarea de fondo para ejecutar
    time.sleep(2.5)

    assert os.path.exists(LOG_FILE)
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    assert "Hola Carmen" in content


def test_18_login_sets_cookie_and_header_and_me_reads_session():
    r = client.post("/login", json={"username": "carmen"})
    assert r.status_code == 200
    # Header X-Logged-In: true
    assert r.headers.get("X-Logged-In") == "true"
    # Cookie de sesión presente
    assert "session_id" in r.cookies

    # Usar la cookie para consultar /me (sesión basada en cookie)
    r2 = client.get("/me", cookies=r.cookies)
    assert r2.status_code == 200
    data = r2.json()
    assert data["logged_in"] is True
    assert isinstance(data["session_id"], str)
    assert data["session_id"].startswith("session-")


def test_18_login_422_when_missing_body():
    # Falta el JSON requerido -> FastAPI debe responder 422 (validation error)
    r = client.post("/login")
    assert r.status_code == 422


def test_14_protected_requires_token_and_accepts_valid_one():
    # 401 sin Authorization
    r = client.get("/protected")
    assert r.status_code == 401

    # Obtener un token con /token (versión simple del ejercicio 14)
    rtok = client.post("/token", params={"username": "carmen", "password": "x"})
    assert rtok.status_code == 200
    token = rtok.json()["access_token"]

    # Acceder con Authorization: Bearer <token>
    r2 = client.get("/protected", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 200
    assert r2.json()["user"] == "carmen"
