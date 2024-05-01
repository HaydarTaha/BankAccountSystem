import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
  };
});
