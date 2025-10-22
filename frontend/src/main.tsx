import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProvider } from "@/providers/app-provider";

createRoot(document.getElementById("root")!).render(<AppProvider />);
