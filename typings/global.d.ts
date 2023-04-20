import type { VNodeChild, PropType as VuePropType, defineComponent } from 'vue';

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  type PropType<T> = VuePropType<T>;
  type VueNode = VNodeChild | JSX.Element;
  type Component<T = any> =
    | ReturnType<typeof defineComponent>
    | (() => Promise<typeof import('*.vue')>)
    | (() => Promise<T>);

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;
  type AnyFunction<T> = (...args: any[]) => T;
  type EmitType = (event: string, ...args: any[]) => void;
  type PromiseFn<T = any, R = T> = (...arg: T[]) => Promise<R>;
  type Fn<T = any, R = T> = (...arg: T[]) => R;

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  interface ViteEnv {
    NODE_ENV: string;
    VITE_USE_MOCK: boolean;
    VITE_PUBLIC_PATH: string;
    VITE_GLOB_API_URL: string;
    VITE_GLOB_API_URL_PREFIX: string;
    VITE_GLOB_UPLOAD_URL: string;
    VITE_GLOB_APP_TITLE: string;
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  }
}
