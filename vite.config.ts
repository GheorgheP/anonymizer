import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { run as manifest } from "./src/manifest";

const staticFiles = [
  "src/manifest/assets/logo-128.png",
  "src/manifest/assets/logo-16.png",
  "src/manifest/assets/logo-24.png",
  "src/manifest/assets/logo-256.png",
  "src/manifest/assets/logo-32.png",
  "src/manifest/assets/logo-64.png",
  "src/manifest/assets/logo.png",
];

type Browser = "chrome" | "firefox";
const browsers: Browser[] = ["chrome", "firefox"];

export default defineConfig(() => {
  const browser = process.env["BROWSER"] as Browser;

  if (!browser || !browsers.includes(browser)) {
    throw new Error(`--browser<${browsers.join("|")}> param is required`);
  }

  const outDir = path.resolve(__dirname, `./dist/${browser}`);

  return {
    plugins: [
      tailwindcss(),
      react(),
      viteStaticCopy({
        targets: staticFiles.map((file) => ({
          src: path.resolve(__dirname, "./", file),
          dest: outDir,
        })),
      }),
      {
        name: "build manifest",
        writeBundle() {
          manifest({ outDir, browser });
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          background: path.resolve(__dirname, "./src/background.ts"),
          content: path.resolve(__dirname, "./src/content/index.tsx"),
        },
        output: {
          format: "es",
          entryFileNames: "[name].js",
          manualChunks: [],
        },
      },
      outDir,
    },
  };
});
