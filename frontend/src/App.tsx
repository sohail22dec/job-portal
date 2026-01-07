import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./Root";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthContextProvider } from "../contexts/AuthContext";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
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
    <AuthContextProvider>
      <RouterProvider router={appRouter} />
    </AuthContextProvider>
  );
}

export default App;
