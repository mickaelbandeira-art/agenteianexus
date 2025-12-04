import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMockUsers } from "./lib/mockUsers";

// Initialize mock users for development
try {
    console.log("Initializing mock users...");
    initializeMockUsers();
    console.log("Mock users initialized successfully");
} catch (error) {
    console.error("Error initializing mock users:", error);
}

try {
    console.log("Rendering App...");
    const root = document.getElementById("root");
    if (!root) {
        throw new Error("Root element not found");
    }
    createRoot(root).render(<App />);
    console.log("App rendered successfully");
} catch (error) {
    console.error("Error rendering app:", error);
    document.body.innerHTML = `<div style="padding: 20px; color: red;">
    <h1>Error loading application</h1>
    <pre>${error instanceof Error ? error.message : String(error)}</pre>
    <pre>${error instanceof Error ? error.stack : ''}</pre>
  </div>`;
}
