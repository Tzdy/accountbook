/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
import Unocss from "unocss/vite";
import presetWind from "@unocss/preset-wind";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    // legacy({
    //   targets: "ie 11",
    // }),
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src", "icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
    Unocss({
      presets: [presetWind()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["test/**/*.test.ts"],
  },
});
