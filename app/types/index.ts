declare global {
	interface Window {
		twikoo?: {
			init: (options: {
				envId: string
				el: string
				region?: string
				path?: string
				lang?: string
			}) => void | Promise<void>
			version: string
		}
	}
}
