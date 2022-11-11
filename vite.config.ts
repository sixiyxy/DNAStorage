import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginImp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // history: createWe
    vitePluginImp({
      optimize: true,
      libList: [
        {
          libName: "antd",
          libDirectory: "es",
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
  ],

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 支持内联 JavaScript
      },
    },
  },
  // 生产版本的前端资源访问统一加上 "/DNA-storage-designer/" 前缀以便于 nginx 处理
  // 但经测试添加 base 会导致开发时无法访问，建议改为构建时添加命令 vite build --base=/dna-storage-designer/
  // base: "/DNA-storage-designer/",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 分包
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});

