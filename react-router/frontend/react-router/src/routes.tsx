import Layout from "./components/Layout";
import Home from "./pages/Home";
import HeroDetail from "./pages/HeroDetail";
import CreateHero from "./pages/CreateHero";
import DeleteHero from "./pages/DeleteHero";

/**
 * Route configuration for React Router.
 * 
 * This array defines all the routes in the application.
 * Each route object can have:
 * - path: The URL path for this route
 * - element: The React component to render
 * - children: Nested routes (rendered inside parent's <Outlet />)
 * - index: If true, this is the default child route (shown at parent's path)
 */
export const routes = [
  {
    // Root route - Layout wraps all pages
    path: "/",
    element: <Layout />,
    // Child routes are rendered inside Layout's <Outlet /> component
    children: [
      {
        // index: true means this is the default route for "/"
        index: true,
        element: <Home />,
      },
      {
        // Dynamic route parameter :heroId - accessible via useParams()
        // Example: /heroes/123 -> heroId = "123"
        path: "heroes/:heroId",
        element: <HeroDetail />,
      },
      {
        path: "create",
        element: <CreateHero />,
      },
      {
        path: "delete",
        element: <DeleteHero />,
      },
    ],
  },
];
