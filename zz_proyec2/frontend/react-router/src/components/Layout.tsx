import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getAuthToken, clearAuthToken } from "../api/clients";
import "./Layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const token = getAuthToken();

  function handleLogout() {
    clearAuthToken();
    navigate("/login");
  }

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Cart
          </NavLink>

          {token && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My orders
            </NavLink>
          )}

          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="nav-link"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
