import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { rsbuildPluginManifest } from "./src/manifest";

const browsers = ["chrome", "firefox"] as const;
type Browser = (typeof browsers)[number];

export default defineConfig((config) => {
  const browser = process.env["BROWSER"] as Browser;

  if (!browser) {
    throw new Error(`BROWSER env variable is required`);
  }

  if (!browsers.includes(browser as Browser)) {
    throw new Error(
      `BROWSER env variable must be one of ${browsers.join("|")}`,
    );
  }

  const rootDir = `./dist/${browser}`;

  return {
    tools: {
      htmlPlugin: false,
      postcss: {
        postcssOptions: {
          plugins: ["@tailwindcss/postcss", "autoprefixer"],
        },
      },
    },
    source: {
      entry: {
        background: "./src/background/index.ts",
        content: "./src/content/index.tsx",
      },
      tsconfigPath: "./tsconfig.content.json",
    },
    output: {
      copy: [
        {
          from: "./src/manifest/assets",
          to: ".",
        },
      ],
      filenameHash: false,
      sourceMap: config.envMode === "development",
      minify: config.envMode === "production",
      distPath: {
        root: rootDir,
        js: ".",
        css: ".",
      },
    },
    plugins: [pluginReact(), rsbuildPluginManifest({ browser })],
    performance: {
      chunkSplit: {
        strategy: "all-in-one",
      },
    },
  };
});
