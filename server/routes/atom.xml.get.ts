import type { ContentCollectionItem } from '@nuxt/content'
import { toDate } from 'date-fns-tz'
import XmlBuilder from 'fast-xml-builder'
import { pascal } from 'radash'
import blogConfig from '~~/blog.config'
import packageJson from '~~/package.json'

const runtimeConfig = useRuntimeConfig()

const builder = new XmlBuilder({
	attributeNamePrefix: '$',
	cdataPropName: '$',
	format: true,
	ignoreAttributes: false,
	textNodeName: '_',
})

function formatIsoDate(date?: string) {
	if (!date)
		return
	try {
		return toDate(date, { timeZone: blogConfig.timezone }).toISOString()
	}
	catch {
		console.error('Invalid date format', date)
		return date
	}
}

function getUrl(path: string | undefined) {
	return new URL(path ?? '', blogConfig.url).toString()
}

function renderContent(post: ContentCollectionItem) {
	return [
		post.image && `<img src="${post.image}" alt="${post.title}" />`,
		post.description && `<p>${post.description}</p>`,
		`<a class="view-full" href="${getUrl(post.path)}" target="_blank">点击查看全文</a>`,
	].join(' ')
}

export default defineEventHandler(async (event) => {
	const posts = await queryCollection(event, 'content')
		.where('stem', 'LIKE', 'posts/%')
		.order('updated', 'DESC')
		.limit(blogConfig.feed.limit)
		.all()

	const entries = posts.map(post => ({
		id: getUrl(post.path),
		title: post.title ?? '',
		updated: formatIsoDate(post.updated),
		author: { name: post.author || blogConfig.author.name },
		content: {
			$type: 'html',
			$: renderContent(post),
		},
		link: { $href: getUrl(post.path) },
		summary: post.description,
		category: { $term: post.categories?.[0] },
		published: formatIsoDate(post.published ?? post.date),
	}))

	const feed = {
		$xmlns: 'http://www.w3.org/2005/Atom',
		id: blogConfig.url,
		title: blogConfig.title,
		updated: runtimeConfig.public.buildTime,
		description: blogConfig.description, // RSS