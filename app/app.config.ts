import type { Nav, NavItem } from '~/types/nav'
import blogConfig from '~~/blog.config'
import { version } from '~~/package.json'

// 图标查询：https://yesicon.app/ph?s=bold
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,

	component: {
		alert: {
			/** 默认使用卡片风格还是扁平风格 */
			defaultStyle: 'card' as 'card' | 'flat',
		},

		codeblock: {
			/** 代码块触发折叠的行数 */
			triggerRows: 32,
			/** 代码块折叠后的行数 */
			collapsedRows: 16,
			/** 启用代码块缩进导航会关闭空格渲染 */
			enableIndentGuide: true,
			/** 代码块缩进导航(Indent Guige)竖线匹配空格数 */
			indent: 4,
			/** tab渲染宽度 */
			tabSize: 3,
			/** 显示代码块行号 */
			showLineNumbers: true,
		},

		/** 文章开头摘要 */
		excerpt: {
			animation: false,
			caret: '_',
		},

		stats: {
			/** 归档页面每年标题对应的年龄 */
			birthYear: 2010,
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: {
			prefix: `© ${new Date().getFullYear()} 筱序二十(新尘网络)`,
			suffix: `<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"><img src="/beian.webp" alt="" style="height:1em;vertical-align:middle;margin-right:0.3em">滇ICP备2026003487号</a> <a href="https://beian.mps.gov.cn/#/query/webSearch?code=53310302000158" target="_blank" rel="noopener noreferrer"><img src="/mps.png" alt="" style="height:1em;vertical-align:middle;margin-right:0.3em">滇公网安备53310302000158号</a>`,
		},
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '个人主页', url: blogConfig.author.homepage },
			{ icon: 'ri:qq-line', text: '交流群: 665751334', url: 'https://qm.qq.com/q/veCtZrS51e' },
			{ icon: 'ph:github-logo-bold', text: 'GitHub: chizw', url: 'https://github.com/chizw' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			{ icon: 'ri:subway-line', text: '开往', url: 'https://www.travellings.cn/plain.html' },
		] satisfies NavItem[],
		/** 页脚站点地图 */
		nav: [
			{
				title: '探索',
				items: [
					{ icon: 'ri:subway-line', text: '开往', url: 'https://www.travellings.cn/plain.html' },
					{ icon: 'ph:bug-droid-bold', text: '揪蝉', url: 'https://www.jiuchan.org/' },
					{ icon: 'fa-solid:blog', text: 'BlogsClub', url: 'https://www.blogsclub.org/' },
					{ icon: 'ph:cloud-bold', text: '八壹云', url: '/81x' },
				],
			},
			{
				title: '社交',
				items: [
					{ icon: 'ph:github-logo-bold', text: 'scfcn', url: 'https://github.com/scfcn' },
					{ icon: 'ri:qq-line', text: '群: 665751334', url: 'https://qm.qq.com/q/veCtZrS51e' },
					{ icon: 'ph:envelope-simple-bold', text: blogConfig.author.email, url: `mailto:${blogConfig.author.email}` },
					{ icon: 'fa:linux', text: 'LinuxDO', url: 'https://linux.do/u/qxzhan/summary' },
				],
			},
			{
				title: '信息',
				items: [
					{ icon: 'simple-icons:nuxtdotjs', text: `主题: Clarity ${version}`, url: 'https://github.com/L33Z22L11/blog-v3' },
					{ icon: 'ph:swatches-bold', text: '主题和组件文档', url: '/theme' },
					{ icon: 'ph:copyright-bold', text: '版权信息', url: '/copyright' },
					{ icon: 'ph:file-text-bold', text: '隐私协议', url: '/privacy' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: blogConfig.author.avatar,
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['🌞', '🤫', '🕊️', '🎍', '👋🏻'],
		gifTail: 'https://s3.qixz.cn/ywty/2026/04/18/69e37c5a29d9d.gif',
		titleColor: '#006934',
	},

	/** 友链页面 */
	link: {
		/** 无订阅源展示静音图标 */
		remindNoFeed: true,
		/** 友链分组内随机排序 */
		randomInGroup: false,
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '文章', url: '/' },
				{ icon: 'ph:archive-bold', text: '归档', url: '/archive' },
				{ icon: 'ph:tag-bold', text: '标签', url: '/tags' },
				{ icon: 'ph:link-bold', text: '友链', url: '/link' },
				{ icon: 'ph:fish-bold', text: '鱼塘', url: '/fcircle' },
				{ icon: 'ph:images-bold', text: '图驿', url: '/gallery' },
				{ icon: 'ph:laptop-bold', text: '装备', url: '/devices' },
			],
		},
	] satisfies Nav,

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as keyof typeof blogConfig.article.order,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	themes: {
		light: {
			icon: 'ph:sun-bold',
			tip: '浅色模式',
		},
		system: {
			icon: 'ph:monitor-bold',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ph:moon-bold',
			tip: '深色模式',
		},
	},
})
