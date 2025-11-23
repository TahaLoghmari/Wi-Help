import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // If the service inside the container only listens on 127.0.0.1:5173, Docker cannot forward external traffic.
    // The host sees the container port, but nothing responds → inaccessible from outside.
    // With host: '0.0.0.0', Vite listens on all container interfaces, so Docker’s port mapping works correctly.

    //Vite is a person inside a room.
    // 127.0.0.1 = person only answers people inside the room.
    // 0.0.0.0 = person answers anyone at any door of the house.
    // Docker is trying to knock on the house door. If the person only listens inside, the visitor cannot get in.
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    open: true,
    allowedHosts: ['.app'],
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.tanstack/tmp/**'],
    },
  },
});
