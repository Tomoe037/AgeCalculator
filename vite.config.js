import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 2020,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 443,
      host: "0.0.0.0",
    },
    // Allow Replit domain
    fs: {
      strict: false,
    },
    allowedHosts: [
      "localhost",
      "*.replit.dev",
      "*.repl.co",
      "*.replit.app",
      "*.riker.replit.dev",
      "c4498c9a-8388-4e12-9307-549b6eabe03a-00-1xb79fdva9x9x.riker.replit.dev",
      "all",
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: 2020,
  },
  // Prevent host check
  optimizeDeps: {
    exclude: ["@capacitor/core"],
  },
});
