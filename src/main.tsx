import "./index.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const ThemeProvider = React.lazy(
  () => import("@/components/providers/theme-provider"),
);
const FirebaseProvider = React.lazy(
  () => import("@/components/providers/firebase-provider"),
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <ThemeProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <FirebaseProvider>
            <RouterProvider router={router} />
          </FirebaseProvider>
        </Suspense>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>,
);
