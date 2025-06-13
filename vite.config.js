import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  base: "./",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "offerte.html",
          dest: ".", // zet het in dist/
        },
      ],
    }),
  ],
});
