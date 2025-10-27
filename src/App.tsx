import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const FirebaseProvider = React.lazy(
  () => import("@/providers/firebase-provider"),
);
const HomePage = React.lazy(() => import("@/pages/home"));
const HistoryPage = React.lazy(() => import("@/pages/history"));
const StatsPage = React.lazy(() => import("@/pages/stats"));
const PointingPage = React.lazy(() => import("@/pages/pointing"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/pointing/:sessionId",
    element: <PointingPage />,
  },
  {
    path: "/pointing/:sessionId/history",
    element: <HistoryPage />,
  },
  {
    path: "/pointing/:sessionId/stats/:storyId",
    element: <StatsPage />,
  },
  {
    path: "*",
    element: <div>Not found</div>,
  },
]);

const App = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <FirebaseProvider>
          <RouterProvider router={router} />
        </FirebaseProvider>
      </Suspense>
    </div>
  );
};

export default App;
