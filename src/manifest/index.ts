import type { RsbuildPlugin } from "@rsbuild/core";
import fs from "fs";
import path from "path";
import manifest from "./manifest.json";

type Browser = "chrome" | "firefox";

interface PluginOptions {
  browser: Browser;
}

export function rsbuildPluginManifest(options: PluginOptions): RsbuildPlugin {
  return {
    name: "rsbuild-plugin-manifest",
    setup(api) {
      api.onAfterBuild(() => {
        const outDir = api.context.distPath;
        const browser = options.browser;
        const clonedManifest = { ...manifest };

        delete (clonedManifest as Record<string, unknown>)["$schema"];

        if (browser === "firefox") {
          clonedManifest.background = {
            // @ts-expect-error, we need to adapt to Firefox manifest v3
            scripts: ["background.js"],
          };
        }

        fs.writeFileSync(
          path.resolve(outDir, "manifest.json"),
          JSON.stringify(clonedManifest, null, 2),
        );
      });
    },
  };
}
