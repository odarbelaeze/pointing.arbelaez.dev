import "./index.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Home } from "@/pages/home";
import { Pointing } from "@/pages/pointing";
import { Stats } from "@/pages/stats";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pointing/:sessionId",
    element: <Pointing />,
  },
  {
    path: "/pointing/:sessionId/stats/:storyId",
    element: <Stats />,
  },
  {
    path: "*",
    element: <div>Not found</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="min-h-screen grid place-items-center bg-background text-foreground">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  </React.StrictMode>,
);
