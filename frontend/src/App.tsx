import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Root";
import Landing from "./pages/shared/Landing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/shared/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import JobSeekerDashboard from "./pages/job-seeker/Dashboard";
import JobsList from "./pages/job-seeker/JobsList";
import JobDetails from "./pages/shared/JobDetails";
import SavedJobs from "./pages/job-seeker/SavedJobs";
import ApplyJob from "./pages/job-seeker/ApplyJob";
import ProfilePage from "./components/job-seeker/ProfilePage";
import Applicants from "./pages/recruiter/Applicants";
import PostJob from "./pages/recruiter/PostJob";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import ErrorPage from "./pages/shared/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import Toast from "./components/Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/recruiter-dashboard",
        element: (
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job-seeker-dashboard",
        element: (
          <ProtectedRoute requiredRole="jobseeker">
            <JobSeekerDashboard />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute requiredRole="jobseeker">
            <ApplyJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:jobId/applicants",
        element: (
          <ProtectedRoute requiredRole="recruiter">
            <Applicants />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute requiredRole="recruiter">
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-job/:jobId",
        element: (
          <ProtectedRoute requiredRole="recruiter">
            <PostJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute requiredRole="jobseeker">
            <SavedJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute requiredRole="jobseeker">
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/company-profile",
        element: (
          <ProtectedRoute requiredRole="recruiter">
            <CompanyProfile />
          </ProtectedRoute>
        ),
      },
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
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ToastProvider>
          <Toast />
          <RouterProvider router={appRouter} />
        </ToastProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;

