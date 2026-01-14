import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Root";
import Landing from "./pages/common/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/common/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import JobSeekerDashboard from "./pages/job-seeker/Dashboard";
import JobsList from "./pages/job-seeker/JobsList";
import JobDetails from "./pages/jobs/JobDetails";
import SavedJobs from "./pages/job-seeker/SavedJobs";
import ApplyJob from "./pages/job-seeker/ApplyJob";
import Applicants from "./pages/recruiter/Applicants";
import PostJob from "./pages/recruiter/PostJob";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import ErrorPage from "./pages/common/ErrorPage";
import { AuthContextProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import Toast from "./components/Toast";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Landing />,
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
        element: <JobsList />,
      },
      {
        path: "/job/:id",
        element: <JobDetails />,
      },
      {
        path: "/job/:jobId/apply",
        element: <ApplyJob />,
      },
      {
        path: "/job/:jobId/applicants",
        element: <Applicants />,
      },
      {
        path: "/post-job",
        element: <PostJob />,
      },
      {
        path: "/edit-job/:jobId",
        element: <PostJob />,
      },
      {
        path: "/saved-jobs",
        element: <SavedJobs />,
      },
      {
        path: "/company-profile",
        element: <CompanyProfile />,
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
      <ToastProvider>
        <Toast />
        <RouterProvider router={appRouter} />
      </ToastProvider>
    </AuthContextProvider>
  );
}

export default App;
