import type {
  ComponentRenderProxy,
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType
} from 'vue'

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
  // declare interface Window {
  //   // Global vue app instance
  //   __APP__: App<Element>;
  // }

  // vue
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

  interface WheelEvent {
    path?: EventTarget[]
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  interface ViteEnv {
    VITE_USE_MOCK: boolean
    VITE_PUBLIC_PATH: string
    VITE_GLOB_APP_TITLE: string
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  }

  function parseInt(s: string | number, radix?: number): number

  function parseFloat(string: string | number): number

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
