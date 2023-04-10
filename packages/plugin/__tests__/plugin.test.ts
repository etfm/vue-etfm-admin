import { describe, expect, test, vitest } from 'vitest'
import { ApplyPluginsType, PluginManager } from '../src/plugin'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

describe('PluginManager', () => {
  test('PluginManager#applyPlugins in async=false mode', async () => {
    const pm = new PluginManager({
      validKeys: ['foo']
    })

    const asyncCall = vitest.fn()
    const syncCall = vitest.fn()

    pm.register({
      apply: {
        foo: async () => {
          await delay(100)
          asyncCall()
        }
      },
      path: '/a'
    })
    pm.register({
      apply: {
        foo: syncCall
      },
      path: '/a'
    })

    await pm.applyPlugins({
      key: 'foo',
      type: ApplyPluginsType.event,
      async: false
    })

    expect(syncCall).toBeCalled()
    expect(asyncCall).not.toBeCalled()
  })

  test('PluginManager#applyPlugins in async=true mode', async () => {
    const pm = new PluginManager({
      validKeys: ['foo']
    })

    const asyncCall = vitest.fn()
    const syncCall = vitest.fn()

    pm.register({
      apply: {
        foo: async () => {
          await delay(100)
          asyncCall()
        }
      },
      path: '/a'
    })
    pm.register({
      apply: {
        foo: syncCall
      },
      path: '/a'
    })

    await pm.applyPlugins({
      key: 'foo',
      type: ApplyPluginsType.event,
      async: true
    })

    expect(syncCall).toBeCalled()
    expect(asyncCall).toBeCalled()
  })
})
