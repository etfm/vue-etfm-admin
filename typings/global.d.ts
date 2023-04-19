import type { VNode, VNodeChild, PropType as VuePropType } from 'vue'

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }

  type PropType<T> = VuePropType<T>
  type VueNode = VNodeChild | JSX.Element

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type Nullable<T> = T | null
  type NonNullable<T> = T extends null | undefined ? never : T
  type Recordable<T = any> = Record<string, T>
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  type Indexable<T = any> = {
    [key: string]: T
  }
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  type TimeoutHandle = ReturnType<typeof setTimeout>
  type IntervalHandle = ReturnType<typeof setInterval>
  type AnyFunction<T> = (...args: any[]) => T

  interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  interface ViteEnv {
    NODE_ENV: string
    VITE_USE_MOCK: boolean
    VITE_PUBLIC_PATH: string
    VITE_GLOB_API_URL: string
    VITE_GLOB_API_URL_PREFIX: string
    VITE_GLOB_UPLOAD_URL: string
    VITE_GLOB_APP_TITLE: string
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  }

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode
  }
}

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare type EmitType = (event: string, ...args: any[]) => void
