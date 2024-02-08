import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { resolve } from "path";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log('running on mode:', mode);
  return defineConfig({
    base: process.env.VITE_BASE,
    plugins: [
      svgLoader(), 
      vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: process.env.VITE_PORT,
    },
  });
};
