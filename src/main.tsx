import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMockUsers } from "./lib/mockUsers";

// Initialize mock users for development
initializeMockUsers();

createRoot(document.getElementById("root")!).render(<App />);
