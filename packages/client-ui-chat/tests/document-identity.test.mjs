import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { transform } from 'esbuild'
import { JSDOM } from 'jsdom'

const source = await readFile(new URL('../src/client/document-identity.ts', import.meta.url), 'utf8')
const { code } = await transform(source, { loader: 'ts', format: 'esm' })
const { installDocumentIdentity } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)

function fixture(html = '<meta name="apple-mobile-web-app-title" content="Original"><link rel="manifest" href="../pwa/app.json">') {
  const dom = new JSDOM(`<title>Original</title>${html}`, { url: 'https://example.test/ui/index.html' })
  const blobs = new Map()
  const revoked = []
  const errors = []
  const calls = []
  let resolve
  let reject
  const pending = new Promise((accept, fail) => { resolve = accept; reject = fail })
  const dispose = installDocumentIdentity(dom.window.document, '.ewh {}', {
    fetch: (...args) => { calls.push(args); return pending },
    urls: {
      createObjectURL: blob => { const url = `blob:identity-${blobs.size}`; blobs.set(url, blob); return url },
      revokeObjectURL: url => revoked.push(url),
    },
    onError: error => errors.push(error),
  })
  return { dom, blobs, revoked, errors, calls, resolve, reject, dispose,
    link: dom.window.document.querySelector('link'),
    meta: dom.window.document.querySelector('meta'),
    close() { dispose(); dom.window.close() },
  }
}

const flush = () => new Promise(resolve => setImmediate(resolve))
const response = manifest => ({ ok: true, url: 'https://example.test/redirect/app.json', json: async () => manifest })

test('manifest preserves original fields and URL semantics while replacing PWA names', async () => {
  const view = fixture()
  const original = {
    name: 'Original', short_name: 'OH', start_url: '../launch', scope: '../', id: 'identity',
    theme_color: '#123456', display: 'standalone', custom: { keep: true },
    icons: [{ src: 'icons/app.png', sizes: '192x192', purpose: 'any' }],
    screenshots: [{ src: '/screen.png', form_factor: 'wide' }],
    shortcuts: [{ name: 'Task', url: './task', icons: [{ src: '../task.png' }] }],
    share_target: { action: './share', method: 'POST', params: { title: 'title' } },
    file_handlers: [{ action: './open', accept: { 'text/plain': ['.txt'] }, icons: [{ src: './file.png' }] }],
    protocol_handlers: [{ protocol: 'web+ewh', url: './protocol?url=%s' }],
    related_applications: [{ platform: 'webapp', url: '/related.json' }],
    serviceworker: { src: './sw.js', scope: './' },
  }
  try {
    assert.equal(view.calls[0][0], 'https://example.test/pwa/app.json')
    assert.equal(view.calls[0][1].credentials, 'same-origin')
    view.resolve(response(structuredClone(original)))
    await flush()
    const url = view.link.getAttribute('href')
    const blob = view.blobs.get(url)
    assert.equal(blob.type, 'application/manifest+json')
    const manifest = JSON.parse(await blob.text())
    const expected = structuredClone(original)
    Object.assign(expected, { name: 'EveryWhere Harness', short_name: 'EWH',
      start_url: 'https://example.test/launch', scope: 'https://example.test/', id: 'https://example.test/identity' })
    expected.icons[0].src = 'https://example.test/redirect/icons/app.png'
    expected.screenshots[0].src = 'https://example.test/screen.png'
    expected.shortcuts[0].url = 'https://example.test/redirect/task'
    expected.shortcuts[0].icons[0].src = 'https://example.test/task.png'
    expected.share_target.action = 'https://example.test/redirect/share'
    expected.file_handlers[0].action = 'https://example.test/redirect/open'
    expected.file_handlers[0].icons[0].src = 'https://example.test/redirect/file.png'
    expected.protocol_handlers[0].url = 'https://example.test/redirect/protocol?url=%s'
    expected.related_applications[0].url = 'https://example.test/related.json'
    expected.serviceworker = { src: 'https://example.test/redirect/sw.js', scope: 'https://example.test/redirect/' }
    assert.deepEqual(manifest, expected)
    assert.equal(view.meta.content, 'EWH')
    assert.equal(view.dom.window.document.title, 'Original')
    view.dispose()
    view.dispose()
    assert.equal(view.meta.content, 'Original')
    assert.equal(view.link.getAttribute('href'), '../pwa/app.json')
    assert.deepEqual(view.revoked, [url])
    assert.equal(view.calls[0][1].signal.aborted, true)
    assert.deepEqual(view.errors, [])
  } finally { view.close() }
})

test('disposal aborts pending requests and prevents late fetch or JSON mutations', async () => {
  for (const phase of ['fetch', 'json']) {
    const view = fixture()
    let finishJson
    try {
      if (phase === 'json') {
        view.resolve({ ok: true, json: () => new Promise(resolve => { finishJson = resolve }) })
        await flush()
      }
      view.dispose()
      if (finishJson) finishJson({ name: 'Late' })
      else view.resolve(response({ name: 'Late' }))
      await flush()
      assert.equal(view.calls[0][1].signal.aborted, true)
      assert.equal(view.blobs.size, 0)
      assert.equal(view.link.getAttribute('href'), '../pwa/app.json')
      assert.equal(view.meta.content, 'Original')
      assert.deepEqual(view.errors, [])
    } finally { view.close() }
  }
})

test('aborted fetch rejection is contained after disposal', async () => {
  const view = fixture()
  try {
    view.dispose()
    view.reject(new DOMException('Aborted', 'AbortError'))
    await flush()
    assert.deepEqual(view.errors, [])
    assert.equal(view.blobs.size, 0)
  } finally { view.close() }
})

test('credentialed manifests without a response URL retain absolute and document-relative URLs', async () => {
  const view = fixture('<link rel="manifest" href="../pwa/app.json" crossorigin="use-credentials">')
  try {
    assert.equal(view.calls[0][1].credentials, 'include')
    view.resolve({ ok: true, url: '', json: async () => ({
      icons: [{ src: 'data:image/png;base64,AAAA' }, { src: '//cdn.example.test/icon.png' }],
      shortcuts: [{ url: '?mode=new' }],
    }) })
    await flush()
    const [blob] = view.blobs.values()
    const manifest = JSON.parse(await blob.text())
    assert.equal(manifest.icons[0].src, 'data:image/png;base64,AAAA')
    assert.equal(manifest.icons[1].src, 'https://cdn.example.test/icon.png')
    assert.equal(manifest.shortcuts[0].url, 'https://example.test/pwa/app.json?mode=new')
    assert.equal('start_url' in manifest, false)
    assert.equal('scope' in manifest, false)
    assert.equal('id' in manifest, false)
  } finally { view.close() }
})

test('cleanup preserves metadata and manifest subsequently changed by other owners', async () => {
  const view = fixture()
  try {
    view.resolve(response({ icons: [{ src: 'data:image/png;base64,AAAA' }] }))
    await flush()
    const [url] = view.blobs.keys()
    assert.ok(url)
    view.meta.content = 'Other application'
    view.link.href = '/other.webmanifest'
    view.dispose()
    assert.equal(view.meta.content, 'Other application')
    assert.equal(view.link.getAttribute('href'), '/other.webmanifest')
    assert.deepEqual(view.revoked, [url])
  } finally { view.close() }
})

test('a replaced manifest link is not overwritten by an in-flight response', async () => {
  const view = fixture()
  try {
    view.link.href = '/other.webmanifest'
    view.resolve(response({ name: 'Late' }))
    await flush()
    assert.equal(view.link.getAttribute('href'), '/other.webmanifest')
    assert.equal(view.blobs.size, 0)
  } finally { view.close() }
})

test('metadata created by this instance is removed and a missing content attribute is restored', () => {
  for (const html of ['', '<meta name="apple-mobile-web-app-title">']) {
    const view = fixture(html)
    try {
      assert.equal(view.meta.content, 'EWH')
      assert.equal(view.calls.length, 0)
      view.dispose()
      const meta = view.dom.window.document.querySelector('meta')
      if (html) assert.equal(meta.getAttribute('content'), null)
      else assert.equal(meta, null)
    } finally { view.close() }
  }
})

test('network, HTTP, JSON and manifest validation failures are reported without changing the manifest link', async () => {
  for (const result of [
    () => Promise.reject(new Error('Offline')),
    () => ({ ok: false, status: 503 }),
    () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON') } }),
    () => response([]),
    () => response({ icons: 'invalid' }),
    () => response({ shortcuts: [null] }),
    () => response({ start_url: 42 }),
    () => response({ share_target: null }),
  ]) {
    const view = fixture()
    try {
      view.resolve(result())
      await flush()
      assert.equal(view.errors.length, 1)
      assert.equal(view.blobs.size, 0)
      assert.equal(view.link.getAttribute('href'), '../pwa/app.json')
    } finally { view.close() }
  }
})