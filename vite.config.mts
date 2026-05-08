import { defineConfig } from "vite";
import foundryvtt from "vite-plugin-foundryvtt";

import systemJson from "./src/system.json";

export default defineConfig({
  base: "/systems/gfv1",
  server: {
    port: 30001,
    open: "/",
    proxy: {
      "^(?!/systems/gfv1)": "http://localhost:30000/",
      "/socket.io": {
        target: "ws://localhost:30000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    rolldownOptions: {
      input: {
        main: "src/gfv1.ts",
      },
      output: {
        entryFileNames: "gfv1.js",
        assetFileNames: "gfv1.css",
        format: "es",
      },
    },
    lib: {
      entry: "src/gfv1.ts",
      name: "gfv1",
      fileName: "gfv1",
      formats: ["es"],
    },
  },
  plugins: [foundryvtt(systemJson)],
});
