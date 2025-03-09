import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  //react()
  plugins: [],
  resolve: {
    alias: [
      { find: "assets", replacement: "/src/assets" },
      { find: "store", replacement: "/src/store" },
      { find: "components", replacement: "/src/components" },
      { find: "views", replacement: "/src/views" },
      { find: "container", replacement: "/src/container" },
      { find: "helpers", replacement: "/src/helpers" },
      { find: "constants", replacement: "/src/constants" },
      { find: "context", replacement: "/src/context" },
    ],
  },
});
