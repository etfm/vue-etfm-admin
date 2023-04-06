import chalk from 'chalk'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { mergeConfig } from 'vite'
import { resolve } from 'path'
import ElementPlus from 'unplugin-element-plus/dist/vite'
export default function createViteConfig(cwd: string, framework: string) {
  console.log()
  console.log(chalk.bgBlue('当前处于开发测试阶段，还会有大量更新，仅供参考，请勿用于实际项目！\n'))
  console.log()

  return defineConfig(async ({ command, mode }) => {
    const root = cwd
    const commonConfig: UserConfig = {
      root,
      base: '/',
      plugins: [vue(), vueJsx(), ElementPlus({})],
      resolve: {
        alias: {
          '@/': `${resolve(root, 'src')}/`
        }
      }
    }
    return mergeConfig(commonConfig, {})
  })
}
