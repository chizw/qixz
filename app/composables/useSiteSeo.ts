import type ArticleProps from '~/types/article'
import { isSeoIndexablePath, resolveCanonicalUrl, resolveSeoImage } from '~/utils/seo'

interface SiteSeoOptions {
	title?: string | (() => string)
	description?: string
	path?: string
	image?: string
	type?: 'article' | 'website'
	indexable?: boolean
	schema?: Record<string, unknown> | Record<string, unknown>[]
}

function getSiteUrl() {
	const appConfig = useAppConfig()
	return appConfig.url || '/'
}

function getFallbackImage() {
	const appConfig = useAppConfig()
	return appConfig.author.avatar || appConfig.favicon
}

function useSchemaScript(schema?: Record<string, unknown> | Record<string, unknown>[]) {
	if (!schema)
		return

	useHead({
		script: [
			{
				type: 'application/ld+json',
				innerHTML: JSON.stringify(Array.isArray(schema) ? schema : [schema]),
			},
		],
	})
}

export function useSiteSeo(options: SiteSeoOptions = {}) {
	const route = useRoute()
	const appConfig = useAppConfig()
	const siteUrl = getSiteUrl()
	const path = options.path || route.path
	const canonical = resolveCanonicalUrl(path, siteUrl)
	const image = resolveSeoImage(options.image, siteUrl, getFallbackImage())
	const description = options.description || appConfig.description
	const indexable = options.indexable ?? isSeoIndexablePath(path)

	useSeoMeta({
		title: options.title,
		description,
		ogTitle: options.title,
		ogDescription: description,
		ogImage: image,
		ogType: options.type || 'website',
		twitterCard: 'summary_large_image',
		twitterTitle: options.title,
		twitterDescription: description,
		twitterImage: image,
		robots: indexable ? 'index,follow' : 'noindex,nofollow',
	})

	useHead({
		link: [
			{ rel: 'canonical', href: canonical },
		],
	})

	useSchemaScript(indexable ? options.schema : undefined)

	return { canonical, image, indexable }
}

export function useHomeSeo(options: { title?: string | (() => string) } = {}) {
	const appConfig = useAppConfig()
	const siteUrl = getSiteUrl()
	const image = resolveSeoImage(undefined, siteUrl, getFallbackImage())

	return useSiteSeo({
		title: options.title,
		description: appConfig.description,
		path: '/',
		image,
		type: 'website',
		schema: [
			{
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				'name': appConfig.title,
				'url': siteUrl,
				'description': appConfig.description,
				'inLanguage': appConfig.language,
			},
			{
				'@context': 'https://schema.org',
				'@type': 'Blog',
				'name': appConfig.title,
				'url': siteUrl,
				'description': appConfig.description,
				'inLanguage': appConfig.language,
			},
			{
				'@context': 'https://schema.org',
				'@type': 'Person',
				'name': appConfig.author.name,
				'url': appConfig.author.homepage,
				'image': image,
				'email': appConfig.author.email,
			},
		],
	})
}

export function useArticleSeo(post: ArticleProps) {
	const appConfig = useAppConfig()
	const siteUrl = getSiteUrl()
	const path = post.path || useRoute().path
	const image = resolveSeoImage(post.image, siteUrl, getFallbackImage())
	const canonical = resolveCanonicalUrl(path, siteUrl)
	const indexable = isSeoIndexablePath(path, post.draft)
	const description = post.description || appConfig.description
	const published = post.date || post.published
	const modified = post.updated || published

	return useSiteSeo({
		title: post.title,
		description,
		path,
		image,
		type: 'article',
		indexable,
		schema: {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			'headline': post.title,
			'description': description,
			'url': canonical,
			'image': image,
			'datePublished': published,
			'dateModified': modified,
			'inLanguage': appConfig.language,
			'author': {
				'@type': 'Person',
				'name': appConfig.author.name,
				'url': appConfig.author.homepage,
				'image': getFallbackImage(),
			},
			'publisher': {
				'@type': 'Organization',
				'name': appConfig.title,
				'logo': {
					'@type': 'ImageObject',
					'url': getFallbackImage(),
				},
			},
			'keywords': post.tags?.join(', '),
			'articleSection': post.categories?.join(', '),
		},
	})
}
