// @nuxt/image 的 screens 配置无法通过 nuxt.config 覆盖（defu 合并策略），
// 导致 NuxtImg 在缺少 width 时生成无效的 srcset '0w' 描述符。
// 此插件通过 MutationObserver 在 DOM 层面监听并修复无效的 srcset。
export default defineNuxtPlugin(() => {
	let fixing = false

	function fixSrcset(el: Element) {
		if (fixing) return
		const srcset = el.getAttribute('srcset')
		if (!srcset || !srcset.includes(' 0w')) return
		fixing = true
		const filtered = srcset
			.split(',')
			.filter(entry => !entry.trim().endsWith(' 0w'))
			.join(',')
		el.setAttribute('srcset', filtered)
		fixing = false
	}

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'srcset') {
				fixSrcset(mutation.target as Element)
			}
			for (const node of mutation.addedNodes) {
				if (node instanceof Element) {
					if (node.tagName === 'IMG') fixSrcset(node)
					node.querySelectorAll?.('img[srcset]').forEach(fixSrcset)
				}
			}
		}
	})

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['srcset'],
		childList: true,
		subtree: true,
	})

	// 页面已有图片也需要修复
	onNuxtReady(() => {
		document.querySelectorAll('img[srcset]').forEach(fixSrcset)
	})
})
