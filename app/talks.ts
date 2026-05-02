import type { TalkItem } from './types/talk'

export interface ApiResponse {
	code: number
	msg: string
	data: {
		total: number
		items: ApiTalkItem[]
	}
}

export interface ApiTalkItem {
	id: string
	content: string
	username: string
	layout: string
	private: boolean
	user_id: string
	tags?: {
		id: string
		name: string
		usage_count: number
		created_at: string | number
	}[]
	echo_files?: {
		id: string
		echo_id: string
		file_id: string
		file: {
			id: string
			key: string
			storage_type: string
			provider: string
			url: string
			name: string
			content_type: string
			size: number
			width: number
			height: number
			category: string
			created_at: string | number
		}
		sort_order: number
	}[]
	extension?: {
		id: string
		type: string
		echo_id: string
		payload?: Record<string, unknown>
	}
	fav_count: number
	created_at: string | number
}

export interface FetchTalksOptions {
	page?: number
	pageSize?: number
}

export async function fetchTalks(options: FetchTalksOptions = {}): Promise<TalkItem[]> {
	const { page = 1, pageSize = 20 } = options
	const baseUrl = 'https://mm.qixz.cn'

	function normalizeDate(date: string | number | undefined): string {
		if (!date)
			return new Date().toISOString()
		if (typeof date === 'number') {
			return new Date(date * 1000).toISOString()
		}
		return date
	}

	function normalizeUrl(url: string | undefined): string | undefined {
		if (!url) return undefined
		if (url.startsWith('http://') || url.startsWith('https://')) return url
		return baseUrl + (url.startsWith('/') ? url : `/${url}`)
	}

	try {
		const response = await fetch(`${baseUrl}/api/echo/page?page=${page}&pageSize=${pageSize}`)
		const data: ApiResponse = await response.json()

		if (data.code !== 1) {
			throw new Error(data.msg || '获取数据失败')
		}

		return data.data.items.map((item) => {
			const talkItem: TalkItem = {
				id: Number.parseInt(item.id.replace(/-/g, '').slice(0, 8), 16),
				text: item.content,
				date: normalizeDate(item.created_at),
				tags: item.tags?.map(tag => tag.name) || [],
				favCount: item.fav_count || 0,
				originalUrl: `${baseUrl}/echo/${item.id}`,
			}

			if (item.echo_files && item.echo_files.length > 0) {
				const imageFiles = item.echo_files.filter(f => f.file?.category === 'image')
				if (imageFiles.length > 0) {
					talkItem.images = imageFiles.map(f => normalizeUrl(f.file?.url)).filter(Boolean) as string[]
				}
			}

			if (item.extension) {
				const extType = item.extension.type?.toUpperCase()
				const payload = item.extension.payload as Record<string, unknown> | undefined

				if (extType === 'VIDEO') {
					const videoPayload = payload as { type?: string, id?: string } | undefined
					const videoId = item.extension.echo_id || item.extension.id
					const videoTypeRaw = videoPayload?.type?.toLowerCase() || 'bilibili'
					const videoType: 'raw' | 'bilibili' | 'bilibili-nano' | 'youtube' | 'douyin' | 'douyin-wide' | 'tiktok' = ['raw', 'bilibili', 'bilibili-nano', 'youtube', 'douyin', 'douyin-wide', 'tiktok'].includes(videoTypeRaw) ? videoTypeRaw as any : 'bilibili'

					talkItem.video = {
						type: videoType,
						id: videoPayload?.id || videoId,
					}
				}
				else if (extType === 'MUSIC') {
					const musicPayload = payload as { 
						type?: string
						id?: string
						author?: string
						artist?: string
						title?: string
						song_name?: string
						name?: string
						url?: string
						cover?: string
						pic?: string
					} | undefined

					let musicType: 'netease' | 'qq' | 'kugou' | 'kuwo' | 'xiami' | 'apple' | 'spotify' = 'netease'
					let musicId = musicPayload?.id || item.extension.id
					let musicTitle = musicPayload?.title || musicPayload?.song_name || musicPayload?.name
					let musicAuthor = musicPayload?.author || musicPayload?.artist
					let musicCover = musicPayload?.cover || musicPayload?.pic
					let musicUrl: string | undefined

					if (musicPayload?.url) {
						let urlStr = String(musicPayload.url).trim()
						urlStr = urlStr.replace(/^`+|`+$/g, '').trim()
						musicUrl = normalizeUrl(urlStr)
						
						if (urlStr.includes('music.163.com')) {
							musicType = 'netease'
							const idMatch = urlStr.match(/[?&]id=(\d+)/)
							if (idMatch) {
								musicId = idMatch[1]
							}
						}
						else if (urlStr.includes('y.qq.com') || urlStr.includes('c.y.qq.com')) {
							musicType = 'qq'
							const idMatch = urlStr.match(/songDetail\/(\w+)/) || urlStr.match(/[?&]id=(\w+)/)
							if (idMatch) {
								musicId = idMatch[1]
							}
						}
						else if (urlStr.includes('kugou.com')) {
							musicType = 'kugou'
						}
						else if (urlStr.includes('kuwo.cn')) {
							musicType = 'kuwo'
						}
						else if (urlStr.includes('spotify.com')) {
							musicType = 'spotify'
							const idMatch = urlStr.match(/track\/(\w+)/)
							if (idMatch) {
								musicId = idMatch[1]
							}
						}
					}

					talkItem.music = {
						type: musicType,
						id: musicId || '',
						author: musicAuthor,
						title: musicTitle,
						url: musicUrl,
						cover: normalizeUrl(musicCover),
					}
				}
				else if (extType === 'WEBSITE' || extType === 'LINK') {
					const linkPayload = payload as { url?: string, title?: string, image?: string, description?: string, favicon?: string } | undefined
					talkItem.link = {
						url: normalizeUrl(linkPayload?.url || item.extension.echo_id) || '',
						title: linkPayload?.title,
						image: normalizeUrl(linkPayload?.image),
						description: linkPayload?.description,
						favicon: normalizeUrl(linkPayload?.favicon),
					}
				}
				else if (extType === 'LOCATION') {
					const locationPayload = payload as { name?: string, address?: string, latitude?: number, longitude?: number, url?: string } | undefined
					talkItem.location = {
						name: locationPayload?.name || '',
						address: locationPayload?.address,
						latitude: locationPayload?.latitude,
						longitude: locationPayload?.longitude,
						url: locationPayload?.url,
					}
				}
				else if (extType === 'GITHUBPROJ') {
					const githubPayload = payload as { owner?: string, repo?: string, url?: string, description?: string, stars?: number, forks?: number } | undefined
					talkItem.github = {
						owner: githubPayload?.owner || '',
						repo: githubPayload?.repo || '',
						url: githubPayload?.url || `https://github.com/${githubPayload?.owner}/${githubPayload?.repo}`,
						description: githubPayload?.description,
						stars: githubPayload?.stars,
						forks: githubPayload?.forks,
					}
				}
			}

			return talkItem
		})
	}
	catch (error) {
		console.error('获取说说数据失败:', error)
		return []
	}
}

export default [] satisfies TalkItem[]
