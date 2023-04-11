import { assert } from './utils'

export class ConfigManager {
  opts: { validKeys: string[] }
  config: {
    [key: string]: any
  } = {}

  constructor(opts: { validKeys: string[] }) {
    this.opts = opts
  }

  register(config: Record<string, any>) {
    assert(config, `plugin register failed, apply must supplied`)
    Object.keys(config).forEach((key) => {
      assert(this.opts.validKeys.indexOf(key) > -1, `register failed, invalid key ${key}.`)
      this.config[key] = config[key]
    })
  }

  getConfig() {
    return this.config
  }

  getKeyConfig(key: string) {
    return this.config[key]
  }

  static create(opts: { validKeys: string[]; config: Record<string, any> }) {
    const configManager = new ConfigManager({
      validKeys: opts.validKeys
    })
    configManager.register(opts.config)
    return configManager
  }
}
