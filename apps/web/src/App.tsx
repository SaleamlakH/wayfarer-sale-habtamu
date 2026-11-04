import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { DesignPage } from "./pages/DesignPage";
import { PlaceDetailPage } from "./pages/PlaceDetailPage";
import { PlacesDiscoverPage } from "./pages/PlacesDiscoverPage";
import { UserProvider } from "./providers/user-provider/UserProvider";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <PlacesDiscoverPage /> },
      { path: "places/:placeId", element: <PlaceDetailPage /> },
    ],
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
