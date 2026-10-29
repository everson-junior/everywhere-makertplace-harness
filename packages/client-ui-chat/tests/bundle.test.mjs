import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

test('browser artifact registers the package without activating the plugin', async () => {
  const code = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  const registrations = []
  runInNewContext(code, { window: { __ModuleLoader__: { load: entry => registrations.push(entry) } } })
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].id, '@everywhere-harness/client-ui-chat')
  const requested = []
  const exports = registrations[0].factory(name => {
    requested.push(name)
    assert.ok(['react', 'react/jsx-runtime'].includes(name), `Unexpected dependency: ${name}`)
    return require(name)
  })
  assert.equal(typeof exports.apply, 'function')
  assert.ok(requested.includes('react'), 'React must use the shared module table')
})