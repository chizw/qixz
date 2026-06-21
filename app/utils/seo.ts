export function resolveCanonicalUrl(pathOrUrl: string | undefined, siteUrl: string) {
	const url = new URL(pathOrUrl || '/', siteUrl)
	url.search = ''
	url.hash = ''
	return url.href
}

export function resolveSeoImage(image: string | undefined, siteUrl: string, fallbackImage: string) {
	return image ? new URL(image, siteUrl).href : fallbackImage
}

export function isSeoIndexablePath(path: string | undefined, draft = false) {
	return !draft && path !== '/preview' && !path?.startsWith('/previews/')
}

export function isSeoPublicPostQuery(path: string) {
	return path === 'posts/%'
}
