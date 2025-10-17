"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("@tailwindcss/vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var path_1 = require("path");
var vite_2 = require("vite");
var vite_plugin_static_copy_1 = require("vite-plugin-static-copy");
var manifest_1 = require("./src/manifest");
var staticFiles = [
    "src/manifest/assets/logo-128.png",
    "src/manifest/assets/logo-16.png",
    "src/manifest/assets/logo-24.png",
    "src/manifest/assets/logo-256.png",
    "src/manifest/assets/logo-32.png",
    "src/manifest/assets/logo-64.png",
    "src/manifest/assets/logo.png",
];
var browsers = ["chrome", "firefox"];
exports.default = (0, vite_2.defineConfig)(function () {
    var browser = process.env["BROWSER"];
    if (!browser || !browsers.includes(browser)) {
        throw new Error("--browser<".concat(browsers.join("|"), "> param is required"));
    }
    var outDir = path_1.default.resolve(__dirname, "./dist/".concat(browser));
    return {
        plugins: [
            (0, vite_1.default)(),
            (0, plugin_react_1.default)(),
            (0, vite_plugin_static_copy_1.viteStaticCopy)({
                targets: staticFiles.map(function (file) { return ({
                    src: path_1.default.resolve(__dirname, "./", file),
                    dest: outDir,
                }); }),
            }),
            {
                name: "build manifest",
                writeBundle: function () {
                    (0, manifest_1.run)({ outDir: outDir, browser: browser });
                },
            },
        ],
        build: {
            rollupOptions: {
                input: {
                    background: path_1.default.resolve(__dirname, "./src/background.ts"),
                    content: path_1.default.resolve(__dirname, "./src/content/index.tsx"),
                },
                output: {
                    format: "es",
                    entryFileNames: "[name].js",
                    manualChunks: [],
                },
            },
            outDir: outDir,
        },
    };
});
