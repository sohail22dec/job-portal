import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Root";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";
import ErrorPage from "./pages/ErrorPage";
import { AuthContextProvider } from "../contexts/AuthContext";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/dashboard",
        element: <RecruiterDashboard />,
      },
      {
        path: "/job/:id",
        element: <JobDetails />,
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={appRouter} />
    </AuthContextProvider>
  );
}

export default App;
