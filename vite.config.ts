/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
import { VitePWA } from "vite-plugin-pwa";
import Unocss from "unocss/vite";
import presetWind from "@unocss/preset-wind";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/account/",
  plugins: [
    legacy({
      targets: "ie 11",
      renderLegacyChunks: false,
    }),
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
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo-192x192.png, logo-512x512.png"],
      // devOptions: {
      //   enabled: true,
      // },
      workbox: {
        runtimeCaching: [
          {
            // 根据正则表达式进行缓存，如果你喜欢 也可以使用/.*/i
            urlPattern: /.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "asoulcnki-api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 1.5,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "记账本",
        short_name: "记账本",
        description: "平平无奇的记账本",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
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
