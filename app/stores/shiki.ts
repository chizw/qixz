import type { BundledLanguage, HighlighterCore, RegexEngine } from 'shiki'

let promise: Promise<HighlighterCore>
let shiki: HighlighterCore

export const useShikiStore = defineStore('shiki', () => {
	const options = {
		themes: {
			light: 'catppuccin-latte',
			dark: 'one-dark-pro',
		},
	}

	async function load() {
		promise ??= loadShiki()
		shiki ??= await promise
		return shiki
	}

	async function loadShiki() {
		const [
			{ createHighlighterCore },
			{ createJavaScriptRegexEngine },
			catppuccinLatte,
			oneDarkPro,
		] = await Promise.all([
			import('shiki/core'),
			import('shiki/engine-javascript.mjs'),
			import('shiki/themes/catppuccin-latte.mjs'),
			import('shiki/themes/one-dark-pro.mjs'),
		])

		// 测试是否支持正则 Modifier: `(?ims-ims:...)`
		let engine: RegexEngine
		try {
			// eslint-disable-next-line prefer-regex-literals, regexp/strict
			void new RegExp('(?i: )')
			engine = createJavaScriptRegexEngine()
		}
		catch {
			const { createOnigurumaEngine } = await import('shiki/engine-oniguruma.mjs')
			// @ts-expect-error CDN 动态引入的包无类型
			engine = await createOnigurumaEngine(import('https://esm.sh/shiki/wasm'))
		}

		return createHighlighterCore({ themes: [catppuccinLatte, oneDarkPro], engine })
	}

	async function loadLang(...langs: string[]) {
		// @ts-expect-error CDN 动态引入的包无类型
		const { bundledLanguages } = await import('https://esm.sh/shiki/langs') as typeof import('shiki/langs')
		const loadedLangs = shiki.getLoadedLanguages()

		await Promise.all(langs
			.filter(unjudged => !loadedLangs.includes(unjudged) && unjudged in bundledLanguages)
			.map(unloaded => bundledLanguages[unloaded as BundledLanguage])
			.map(dynamicLang => dynamicLang().then(grammar => shiki.loadLanguage(grammar))),
		)
	}

	return {
		options,
		load,
		loadLang,
	}
})
