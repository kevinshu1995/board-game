import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import "dotenv/config";

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
        plugins: [vue(), svgLoader()],
    });
};

