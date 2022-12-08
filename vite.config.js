import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path'
//判断是否是生产环境
const isProd = process.env.NODE_ENV === 'production'
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@stores': resolve(__dirname, 'src/stores')
    }
  },
  build: {
    minify: 'terser',
    chunkSizeWarningLimit: 1000, // 提高超大静态资源警告大小
    assetsDir: 'assets',
    outDir: resolve(__dirname, 'dist'),
    sourcemap: !isProd,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]'
      }
    }
  },
  plugins: [
    vue(),
    viteCompression({
      verbose: true, // 输出压缩成功
      disable: false, // 是否禁用
      threshold: 1, // 体积大于阈值会被压缩，单位是b
      algorithm: 'gzip', // 压缩算法
      ext: '.gz',// 生成的压缩包后缀
    }),
  ]
})
