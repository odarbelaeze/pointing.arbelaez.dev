import "./index.css";
import { FirebaseProvider } from "@/components/providers/firebase-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { HomePage } from "@/pages/home";
import { PointingPage } from "@/pages/pointing";
import { StatsPage } from "@/pages/stats";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

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
    <FirebaseProvider>
      <ThemeProvider>
        <div className="min-h-screen grid place-items-center bg-background text-foreground">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </FirebaseProvider>
  </React.StrictMode>,
);
