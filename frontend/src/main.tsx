import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProvider } from "@/providers/app-provider";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider />
  </StrictMode>
);
