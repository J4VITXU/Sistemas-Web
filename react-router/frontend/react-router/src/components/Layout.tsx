/**
 * NavLink: A special <Link> that knows if it's "active" (current URL matches).
 * - The `to` prop specifies the destination path
 * - The `className` prop can be a function that receives { isActive } to style active links
 * 
 * Outlet: A placeholder where child routes are rendered.
 * - When URL is "/", <Home /> is rendered inside <Outlet />
 * - When URL is "/create", <CreateHero /> is rendered inside <Outlet />
 */
import { NavLink, Outlet } from "react-router";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          {/* 
            NavLink automatically adds "active" state when the URL matches.
            The `end` prop ensures "/" only matches exactly "/" and not "/create" etc.
          */}
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
            Home
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Create
          </NavLink>
          <NavLink to="/delete" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Delete
          </NavLink>
        </nav>
      </header>
      <main className="main">
        {/* 
          <Outlet /> renders the matching child route component.
          This is where Home, CreateHero, DeleteHero, or HeroDetail will appear.
        */}
        <Outlet />
      </main>
    </div>
  );
}
