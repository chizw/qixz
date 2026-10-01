declare global {
	interface Window {
		twikoo?: {
			init: (options: {
				envId: string
				el: string
				region?: string
				path?: string
				lang?: string
				/** Prism 代码高亮资源地址，默认为 jsDelivr */
				prismCdn?: string
			}) => void | Promise<void>
			version: string
		}
	}
}
