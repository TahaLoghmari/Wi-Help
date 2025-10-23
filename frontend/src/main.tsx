import { createRoot } from "react-dom/client";
import "./index.css";
import "@/config/i18n"; 
import { AppProvider } from "@/providers/AppProvider";

createRoot(document.getElementById("root")!).render(<AppProvider />);
