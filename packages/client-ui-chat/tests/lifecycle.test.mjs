import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { JSDOM } from 'jsdom'
import { act, createElement, Fragment, useSyncExternalStore } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const code = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')

function activate(document, declarations = new Set([
  'sidebar.brand.mark', 'sidebar.brand.name', 'conversation.hero.brand.mark', 'conversation.chat.running.icon', 'shell.document.title',
])) {
  let factory
  runInNewContext(code, { document, AbortController, URL, Blob, console,
    fetch: () => { throw new Error('Unexpected network request') },
    window: { __ModuleLoader__: { load: entry => { factory = entry.factory } } } })
  const plugin = factory(name => require(name))
  const contributions = new Map()
  const disposers = []
  const waiting = new Map()
  const ctx = {
    effect: create => { disposers.push(create()) },
    slots: {
      inject(name, create) {
        if (declarations.has(name)) disposers.push(create())
        else waiting.set(name, create)
      },
      register(options, Component) {
        assert.ok(declarations.has(options.name))
        contributions.set(options.name, { options, Component })
        return () => { contributions.delete(options.name) }
      },
    },
  }
  plugin.apply(ctx)
  return {
    contributions,
    waiting,
    dispose() {
      for (const dispose of disposers.splice(0).reverse()) dispose()
      waiting.clear()
    },
  }
}

test('activation owns styles, metadata and five prioritized visual contributions', () => {
  const dom = new JSDOM('<title>Original Harness</title>')
  try {
    const active = activate(dom.window.document)
    assert.equal(dom.window.document.title, 'Original Harness')
    assert.equal(dom.window.document.querySelector('meta[name="apple-mobile-web-app-title"]').content, 'EWH')
    const style = dom.window.document.querySelector('style[data-plugin]')
    assert.ok(style.textContent.includes('@media (prefers-reduced-motion: reduce)'))
    assert.equal(active.contributions.size, 5)
    for (const { options } of active.contributions.values()) assert.equal(options.priority, -100)
    active.dispose()
    active.dispose()
    assert.equal(active.contributions.size, 0)
    assert.equal(dom.window.document.title, 'Original Harness')
    assert.equal(dom.window.document.querySelector('style[data-plugin]'), null)
    assert.equal(dom.window.document.querySelector('meta[name="apple-mobile-web-app-title"]'), null)
    const reactivated = activate(dom.window.document)
    assert.equal(dom.window.document.querySelectorAll('style[data-plugin]').length, 1)
    reactivated.dispose()
  } finally {
    dom.window.close()
  }
})

test('disposal does not overwrite a title subsequently owned by another surface', () => {
  const dom = new JSDOM('<title>Original Harness</title>')
  try {
    const active = activate(dom.window.document)
    dom.window.document.title = 'Session: customer task'
    active.dispose()
    assert.equal(dom.window.document.title, 'Session: customer task')
  } finally {
    dom.window.close()
  }
})

test('hosts without the running icon slot retain the other visual contributions', () => {
  const dom = new JSDOM('<title>Harness</title>')
  try {
    const active = activate(dom.window.document, new Set([
      'sidebar.brand.mark', 'sidebar.brand.name', 'conversation.hero.brand.mark',
    ]))
    assert.equal(active.contributions.size, 3)
    assert.ok(active.waiting.has('conversation.chat.running.icon'))
    assert.ok(active.waiting.has('shell.document.title'))
    active.dispose()
    assert.equal(active.waiting.size, 0)
  } finally {
    dom.window.close()
  }
})

test('repeated heart artwork has unique SVG ids and local mask references', () => {
  const dom = new JSDOM('<title>Harness</title>')
  try {
    const active = activate(dom.window.document)
    const SidebarMark = active.contributions.get('sidebar.brand.mark').Component
    const HeroMark = active.contributions.get('conversation.hero.brand.mark').Component
    const html = renderToStaticMarkup(createElement(Fragment, null,
      createElement(SidebarMark, { size: 24 }), createElement(SidebarMark, { size: 24 }),
      createElement(HeroMark, { size: 34 }),
    ))
    const rendered = new JSDOM(html)
    try {
      const ids = [...rendered.window.document.querySelectorAll('[id]')].map(element => element.id)
      assert.equal(new Set(ids).size, ids.length)
      for (const element of rendered.window.document.querySelectorAll('[mask]')) {
        const id = element.getAttribute('mask').slice(5, -1)
        assert.ok(rendered.window.document.getElementById(id), `Missing mask: ${id}`)
      }
      assert.equal(rendered.window.document.querySelectorAll('.ewh-chat-orbit').length, 9)
    } finally {
      rendered.window.close()
    }
    active.dispose()
  } finally {
    dom.window.close()
  }
})

test('title slot follows retained main sessions, title edits and panel selection without clobbering later owners', async () => {
  const dom = new JSDOM('<title>Original Harness</title><div id="root"></div>')
  const previousWindow = globalThis.window
  const previousAct = globalThis.IS_REACT_ACT_ENVIRONMENT
  globalThis.window = dom.window
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const active = activate(dom.window.document)
  const root = createRoot(dom.window.document.getElementById('root'))
  const listeners = new Set()
  let sessions = { byId: {} }
  let panel = { activePanelId: null }
  const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener) }
  const props = {
    productTitle: 'Original Harness',
    useSessions: selector => useSyncExternalStore(subscribe, () => selector(sessions)),
    usePanelInfo: selector => useSyncExternalStore(subscribe, () => selector(panel)),
  }
  const update = async change => act(async () => { change(); for (const listener of listeners) listener() })
  try {
    const Title = active.contributions.get('shell.document.title').Component
    await act(async () => root.render(createElement(Title, props)))
    assert.equal(dom.window.document.title, 'EveryWhere Harness')
    await update(() => { sessions = { byId: {
      sidebar: { title: 'Not selected', retainedBy: { sidebar: 1 } },
      selected: { title: 'Customer task', retainedBy: { mainView: 1 } },
    } } })
    assert.equal(dom.window.document.title, 'Customer task \u2014 EveryWhere Harness')
    await update(() => { sessions = { byId: { selected: { title: 'Renamed', retainedBy: { mainView: 1 } } } } })
    assert.equal(dom.window.document.title, 'Renamed \u2014 EveryWhere Harness')
    await update(() => { sessions = { byId: {
      selected: { title: 'Renamed', retainedBy: { sidebar: 1 } },
      next: { title: 'Next session', retainedBy: { mainView: 1 } },
    } } })
    assert.equal(dom.window.document.title, 'Next session \u2014 EveryWhere Harness')
    await update(() => { panel = { activePanelId: 'settings' } })
    assert.equal(dom.window.document.title, 'EveryWhere Harness')
    await update(() => { panel = { activePanelId: null } })
    assert.equal(dom.window.document.title, 'Next session \u2014 EveryWhere Harness')
    await update(() => { sessions = { byId: {} } })
    assert.equal(dom.window.document.title, 'EveryWhere Harness')
    await act(async () => root.render(null))
    assert.equal(dom.window.document.title, 'Original Harness')
    assert.equal(listeners.size, 0)
    await act(async () => root.render(createElement(Title, props)))
    dom.window.document.title = 'Another owner'
    await act(async () => root.unmount())
    assert.equal(dom.window.document.title, 'Another owner')
    assert.equal(listeners.size, 0)
  } finally {
    await act(async () => root.unmount())
    active.dispose()
    globalThis.window = previousWindow
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousAct
    dom.window.close()
  }
})