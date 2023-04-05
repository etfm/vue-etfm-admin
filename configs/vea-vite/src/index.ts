import chalk from 'chalk'
import { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { mergeConfig } from 'vite'

export default function createViteConfig(cwd: string, framework: string) {
  console.log()
  console.log(cwd, framework)
  console.log(chalk.bgBlue('当前处于开发测试阶段，还会有大量更新，仅供参考，请勿用于实际项目！\n'))
  console.log()

  return defineConfig(async () => {
    const commonConfig: UserConfig = {
      plugins: [vue(), vueJsx()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      }
    }
    return mergeConfig(commonConfig, {})
  })
}
