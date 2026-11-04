import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { DesignPage } from "./pages/DesignPage";
import { UserProvider } from "./providers/user-provider/UserProvider";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [{ index: true, element: <div /> }],
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: "design",
          element: <DesignPage />,
        },
      ]
    : []),
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
