import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { installDocumentIdentity } from './document-identity.js'
import { DocumentTitle } from './DocumentTitle.js'
import { BrandName, HeroMark, RunningMark, SidebarMark } from './visuals.js'
import styles from './styles.css'

declare module '@deepseek-ai/dsh-client-ui-slots' {
	interface SlotMap {
		'conversation.chat.running.icon': { kind: 'single'; scope: 'session'; owner: Record<never, never> }
		'shell.document.title': { kind: 'single'; scope: 'root'; owner: { productTitle: string } }
	}
}

/** The original Harness owns every service and the conversation data. */
export const inject = ['slots']

/**
 * Register the Everywhere visual contributions for the lifetime of this plugin.
 * @param ctx - Client plugin context supplied by Cordis.
 */
export function apply(ctx: Context): void {
	ctx.effect(() => installDocumentIdentity(document, styles))
	ctx.slots.inject('shell.document.title', () => ctx.slots.register({
		name: 'shell.document.title', priority: -100,
	}, DocumentTitle))
	ctx.slots.inject('sidebar.brand.mark', () => ctx.slots.register({
		name: 'sidebar.brand.mark', priority: -100,
	}, SidebarMark))
	ctx.slots.inject('sidebar.brand.name', () => ctx.slots.register({
		name: 'sidebar.brand.name', priority: -100,
	}, BrandName))
	ctx.slots.inject('conversation.hero.brand.mark', () => ctx.slots.register({
		name: 'conversation.hero.brand.mark', priority: -100,
	}, HeroMark))
	ctx.slots.inject('conversation.chat.running.icon', () => ctx.slots.register({
		name: 'conversation.chat.running.icon', priority: -100,
	}, RunningMark))
}