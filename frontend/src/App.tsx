import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Root";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Applicants from "./pages/Applicants";
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
        element: <Dashboard />,
      },
      {
        path: "/recruiter-dashboard",
        element: <RecruiterDashboard />,
      },
      {
        path: "/job-seeker-dashboard",
        element: <JobSeekerDashboard />,
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/job/:id",
        element: <JobDetails />,
      },
      {
        path: "/job/:jobId/applicants",
        element: <Applicants />,
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
