import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import "dotenv/config";
import VueMacros from "unplugin-vue-macros/vite";
import AutoImport from "unplugin-auto-import/vite";

import type { InlineConfig } from "vitest";
import type { UserConfig } from "vite";

interface VitestConfigExport extends UserConfig {
    test: InlineConfig;
}

// https://vitejs.dev/config/
export default ({}) => {
    return defineConfig({
        resolve: {
            alias: [
                { find: "@", replacement: "/src" },
                { find: "@view", replacement: "/src/components/view" },
                { find: "@widget", replacement: "/src/components/widget" },
                { find: "@composable", replacement: "/src/lib/composable" },
                { find: "@utils", replacement: "/src/lib/utils" },
                { find: "@flowbite", replacement: "/node_modules/flowbite/src/flowbite" },
            ],
        },
        server: {
            proxy: {
                "/functions": {
                    target: process.env.VITE_SUPABASE_FUNCTION_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/functions/, ""),
                },
                "/supabase": {
                    target: process.env.VITE_SUPABASE_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/supabase/, ""),
                },
            },
        },
        test: {
            globals: true,
            environment: "happy-dom",
            setupFiles: ["./mock/server.ts"],
        },
        plugins: [
            AutoImport({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                ],
                imports: ["vue", "vue-router", "pinia", "vitest"],
                dts: true,
                eslintrc: {
                    enabled: false,
                },
            }),
            VueMacros({
                plugins: {
                    vue: vue(),
                },
            }),
            // vue(),
            svgLoader(),
        ],
    } as VitestConfigExport);
};

