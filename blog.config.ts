import type { FeedEntry } from './app/types/feed'

const basicConfig = {
	title: '青序栈',
	subtitle: '青序成栈·向简而生',
	// 长 description 利好于 SEO
	description: '青序栈：代码与远方交汇的小站。这里记录网站部署的实战经验、技术学习的点滴思考，也分享旅途中的风景与感悟。欢迎驻足，交换故事。',
	author: {
		name: '筱序二十',
		avatar: 'https://www.qixz.cn/avatar.avif',
		email: 'qxbk@qq.com',
		homepage: 'https://me.qixz.cn/',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: 'https://www.qixz.cn/favicon.svg',
	language: 'zh-CN',
	timeEstablished: '2024-07-18',
	timezone: 'Asia/Shanghai',
	url: 'https://www.qixz.cn/',
	defaultCategory: '未分类',
}

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	article: {
		categories: {
			[basicConfig.defaultCategory]: { icon: 'ph:folder-dotted-bold' },
			技术干货: { icon: 'ph:cpu-bold', color: '#3af' },
			随笔杂谈: { icon: 'ph:pen-nib-bold', color: '#3ba' },
			游览河山: { icon: 'ph:mountains-bold', color: '#f77' },
			学习笔记: { icon: 'ph:notebook-bold', color: '#77f' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 文章版式，首个为默认版式 */
		types: {
			tech: { icon: 'ph:cpu-bold', color: '#3af' },
			story: { icon: 'ph:pen-nib-bold', color: '#3ba' },
		},
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: ['/preview', '/previews/*'],
	},

	/** ChronoFrame 图驿服务配置 */
	chronoframe: {
		/** ChronoFrame 部署地址 */
		baseUrl: 'https://tuyi.qixz.cn',
	},

	/** 赞赏配置 */
	donation: {
		enable: true,
		message: '感谢您的支持，这将激励我创作更多优质内容！',
		items: {
			支付宝: 'https://s3.qixz.cn/ywty/2026/04/19/69e44a1215c90.jpg',
			微信: 'https://s3.qixz.cn/ywty/2026/04/19/69e44a12141af.png',
		},
	},

	/** 博客 Atom 订阅源 */
	feed: {
		/** 订阅源最大文章数量 */
		limit: 50,
		/** 订阅源是否启用XSLT样式 */
		enableStyle: true,
	},

	/** GitHub 仓库配置 */
	github: {
		/** 仓库地址 */
		repo: 'scfcn/blog-v3',
	},

	/** Bing IndexNow 配置 */
	indexNow: {
		enable: true,
		key: '62b408c96e384086be35d761c56d77cb',
	},

	/** 向 <head> 中添加脚本 */
	scripts: [
		// 自己部署的 Umami 统计服务
		{ src: 'https://um.qixz.cn/script.js', websiteId: '55ed3ffd-f0d7-4b3b-b8b2-e49f3507d028', defer: true, crossorigin: 'anonymous' as const },
		// Twikoo 评论系统
		{ src: 'https://registry.npmmirror.com/twikoo/1.7.7/files/dist/twikoo.min.js', defer: true, crossorigin: 'anonymous' as const },
	],

	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: 'https://twikoo.qixz.cn/',
		preload: 'https://twikoo.qixz.cn/',
	},
}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: '青序栈',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'Cloudflare'],
	date: blogConfig.timeEstablished,
	comment: '栈主本栈啦~',
}

export default blogConfig
