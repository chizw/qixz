import type { NitroConfig } from 'nitropack'
import { arch, env, version as nodeVersion, platform } from 'node:process'
import { name as ciName, CLOUDFLARE_PAGES, GITHUB_ACTIONS, NETLIFY } from 'ci-info'
import { pascal } from 'radash'
import blogConfig from './blog.config'
import packageJson from './package.json'
import redirectList from './redirects.json'

// 此处配置无需修改
export default defineNuxtConfig({
	app: {
		head: {
			meta: [
				{ name: 'author', content: [blogConfig.author.name, blogConfig.author.email].filter(Boolean).join(', ') },
				// 此处为元数据的生成器标识，不建议修改
				{ 'name': 'generator', 'content': `${pascal(packageJson.name)} ${packageJson.version}`, 'data-github-repo': packageJson.homepage },
				{ name: 'mobile-web-app-capable', content: 'yes' },
			],
			link: [
				{ rel: 'icon', href: blogConfig.favicon },
				{ rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
				{ rel: 'preconnect', href: blogConfig.twikoo.preload },
				{ rel: 'stylesheet', href: 'https://fastjs.qixz.cn/npm/katex@0.16.28/dist/katex.min.css', media: 'print', onload: 'this.media="all"' },
				// "霞鹜文楷" 字体
				{ rel: 'stylesheet', href: 'https://fastjs.qixz.cn/gh/scfcn/Sharding-fonts@main/LXGWWenKai-Regular/result.css', media: 'print', onload: 'this.media="all"' },
				// "JetBrains Mono", 思源黑体 "Noto Sans SC", 思源宋体 "Noto Serif SC"
				{ rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap', media: 'print', onload: 'this.media="all"' },
				// 小米字体 "MiSans"
				{ rel: 'stylesheet', href: 'https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,450,500,600,650,700,900:Chinese_Simplify,Latin&display=swap', media: 'print', onload: 'this.media="all"' },
			],
			templateParams: {
				separator: '|',
			},
			titleTemplate: `%s %separator ${blogConfig.title}`,
			script: blogConfig.scripts as any,
		},
		rootAttrs: {
			id: 'z-root',
		},
	},

	typescript: {
		tsConfig: {
			compilerOptions: {
				types: [], // 清空默认类型，避免unplugin-yaml/types错误
			},
		},
	},

	compatibilityDate: '2024-08-03',

	components: [
		{ path: '~/components/partial', prefix: 'Z' },
		'~/components',
	],

	css: [
		'@/assets/css/animation.scss',
		'@/assets/css/article.scss',
		'@/assets/css/color.scss',
		'@/assets/css/font.scss',
		'@/assets/css/main.scss',
		'@/assets/css/reusable.scss',
	],

	// @keep-sorted
	experimental: {
		typescriptPlugin: true,
	},

	features: {
		inlineStyles: false,
	},

	nitro: {
		prerender: {
			// 修复部分平台会在文章路径后添加 `/`，导致闪现 404 错误
			// https://github.com/nuxt/content/issues/2378
			autoSubfolderIndex: CLOUDFLARE_PAGES || GITHUB_ACTIONS || NETLIFY ? false : undefined,
		},
		compressPublicAssets: {
			gzip: true,
			brotli: true,
		},
	},

	// @keep-sorted
	routeRules: {
		...Object.entries(redirectList)
			.reduce<NitroConfig['routeRules']>((acc, [from, to]) => {
				acc![from] = { redirect: { to, statusCode: 308 } }
				return acc
			}, {}),
		'/api/stats': { prerender: true, headers: { 'Content-Type': 'application/json' } },
		'/atom.xml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
		'/qxz.opml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
	},

	runtimeConfig: {
		// @keep-sorted
		public: {
			arch,
			buildTime: new Date().toISOString(),
			// EdgeOne 检测暂时不可用
			ci: env.TENCENTCLOUD_RUNENV === 'SCF' ? 'EdgeOne' : ciName || '',
			nodeVersion,
			platform,
		},
	},

	/** 在生产环境启用 sourcemap */
	// sourcemap: true,

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/css/_variable.scss" as *;',
				},
			},
		},
		define: {
			/** 在生产环境启用 Vue DevTools */
			// __VUE_PROD_DEVTOOLS__: 'true',
			/** 在生产环境启用 Vue 水合不匹配详情 */
			// __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
		},
		server: {
			allowedHosts: true,
		},
	},

	// @keep-sorted
	modules: [
		'@nuxt/content',
		'@nuxt/hints',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxtjs/color-mode',
		'@nuxtjs/seo',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'nuxt-llms',
		'unplugin-yaml/nuxt',
	],

	colorMode: {
		preference: 'system',
		fallback: 'light',
		classSuffix: '',
	},

	content: {
		build: {
			markdown: {
				highlight: false,
				// @keep-sorted
				remarkPlugins: {
					'remark-math': {},
					'remark-music': {},
					'remark-reading-time': {},
				},
				// @keep-sorted
				rehypePlugins: {
					'rehype-katex': {},
				},
				toc: { depth: 4, searchDepth: 4 },
			},
		},
		experimental: {
			sqliteConnector: 'native',
		},
	},

	hooks: {
		'ready': () => {
			console.info(`
================================
${pascal(packageJson.name)} ${packageJson.version}
${packageJson.homepage}
================================
`)
		},
		'content:file:afterParse': async (ctx) => {
			const permalink = ctx.content.permalink as string
			if (permalink) {
				ctx.content.path = permalink
			}
			else {
				// 在 URL 中隐藏文件路由自动生成的 /posts 路径前缀
				if (blogConfig.article.hidePostPrefix) {
					const realPath = ctx.content.path as string | undefined
					ctx.content.path = realPath?.replace(/^\/posts/, '')
				}
			}

			// 通知 IndexNow
			if (blogConfig.indexNow.enable && blogConfig.indexNow.key && ctx.content.path) {
				try {
					const url = new URL(ctx.content.path as string, blogConfig.url).href
					const articleDate = new Date(ctx.content.updated as string || ctx.content.date as string)
					const daysSinceUpdate = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24)

					if (daysSinceUpdate > 30) {
						console.info(`IndexNow: ${url} not recently updated (${Math.floor(daysSinceUpdate)} days ago), skipping`)
						return
					}

					const keyLocation = new URL(`/${blogConfig.indexNow.key}.txt`, blogConfig.url).href
					const requestBody = JSON.stringify({
						host: new URL(blogConfig.url).hostname,
						key: blogConfig.indexNow.key,
						keyLocation,
						urlList: [url],
					})
					await fetch('https://www.bing.com/indexnow', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
						},
						body: requestBody,
					})
					console.info(`IndexNow: ${url} submitted successfully`)
				}
				catch (error) {
					console.error('IndexNow submission failed:', error)
				}
			}
		},
	},

	icon: {
		customCollections: [
			{ prefix: 'zi', dir: './app/assets/icons' },
		],
		clientBundle: {
			scan: {
				globInclude: ['**\/*.{vue,jsx,tsx,ts,md,mdc,mdx}'],
			},
		},
	},

	image: {
		// Neylify 下 netlify 处理器无法显示站外图片，ipx 处理器无法显示站内图片，需彻底禁用
		// https://github.com/nuxt/image/issues/1353
		provider: NETLIFY ? 'none' : undefined,
		format: ['avif', 'webp', 'jpeg'],
		quality: 80,
		screens: {
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			xxl: 1536,
		},
	},

	linkChecker: {
		// @keep-sorted
		skipInspections: [
			'no-baseless',
			'no-non-ascii-chars',
			'no-uppercase-chars',
		],
	},

	llms: {
		domain: blogConfig.url,
		title: blogConfig.title,
		description: blogConfig.description,
	},

	ogImage: {
		enabled: false,
	},

	robots: {
		disableNuxtContentIntegration: true,
		disallow: blogConfig.article.robotsNotIndex,
	},

	site: {
		name: blogConfig.title,
		url: blogConfig.url,
		defaultLocale: blogConfig.language,
	},
})
