import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { DesignPage } from "./pages/DesignPage";
import { ErrorPage } from "./pages/ErrorPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlaceDetailPage } from "./pages/PlaceDetailPage";
import { PlacesDiscoverPage } from "./pages/PlacesDiscoverPage";
import { UserProvider } from "./providers/user-provider/UserProvider";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <PlacesDiscoverPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "places/:placeId",
        element: <PlaceDetailPage />,
        errorElement: <ErrorPage />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: "design",
          element: <DesignPage />,
          errorElement: <ErrorPage />,
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
