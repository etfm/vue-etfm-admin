import { assert, isPromiseLike } from './utils'

export class PluginManager {
  opts: { validKeys: string[] }
  hooks: {
    [key: string]: any
  } = {}
  constructor(opts: { validKeys: string[] }) {
    this.opts = opts
  }

  register(plugin: any) {
    assert(plugin, `plugin register failed, apply must supplied`)
    Object.keys(plugin).forEach((key) => {
      assert(this.opts.validKeys.indexOf(key) > -1, `register failed, invalid key ${key}.`)
      this.hooks[key] = (this.hooks[key] || []).concat(plugin[key])
    })
  }

  getHooks(keyWithDot: string) {
    const [key, ...memberKeys] = keyWithDot.split('.')
    let hooks = this.hooks[key] || []
    if (memberKeys.length) {
      hooks = hooks
        .map((hook: any) => {
          try {
            let ret = hook
            for (const memberKey of memberKeys) {
              ret = ret[memberKey]
            }
            return ret
          } catch (e) {
            return null
          }
        })
        .filter(Boolean)
    }
    return hooks
  }

  applyPlugins({
    key,
    initialValue = {},
    args,
    async
  }: {
    key: string
    initialValue?: any
    args?: object
    async?: boolean
  }) {
    const hooks = this.getHooks(key) || []

    if (args) {
      assert(typeof args === 'object', `applyPlugins failed, args must be plain object.`)
    }

    if (async) {
      return hooks.reduce(
        async (memo: any, hook: Function | Promise<any> | object) => {
          assert(
            typeof hook === 'function' || typeof hook === 'object' || isPromiseLike(hook),
            `applyPlugins failed, all hooks for key ${key} must be function, plain object or Promise.`
          )
          if (isPromiseLike(memo)) {
            memo = await memo
          }
          if (typeof hook === 'function') {
            const ret = hook(memo, args)
            if (isPromiseLike(ret)) {
              return await ret
            } else {
              return ret
            }
          } else {
            if (isPromiseLike(hook)) {
              hook = await hook
            }
            return { ...memo, ...hook }
          }
        },
        isPromiseLike(initialValue) ? initialValue : Promise.resolve(initialValue)
      )
    } else {
      return hooks.reduce((memo: any, hook: Function | object) => {
        assert(
          typeof hook === 'function' || typeof hook === 'object',
          `applyPlugins failed, all hooks for key ${key} must be function or plain object.`
        )
        if (typeof hook === 'function') {
          return hook(memo, args)
        } else {
          // TODO: deepmerge?
          return { ...memo, ...hook }
        }
      }, initialValue)
    }
  }

  static create(opts: { validKeys: string[]; plugin: any }) {
    const pluginManager = new PluginManager({
      validKeys: opts.validKeys
    })
    pluginManager.register(opts.plugin)
    return pluginManager
  }
}
