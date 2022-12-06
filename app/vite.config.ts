import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import "dotenv/config";

// https://vitejs.dev/config/
export default ({ mode }) => {
    return defineConfig({
        resolve: {
            alias: [
                { find: "@", replacement: "/src" },
                { find: "@view", replacement: "/src/components/view" },
                { find: "@widget", replacement: "/src/components/widget" },
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

