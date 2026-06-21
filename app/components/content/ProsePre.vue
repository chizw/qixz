<script setup lang="ts">
const props = withDefaults(defineProps<{
	code?: string
	language?: string
	filename?: string
	highlights?: number[]
	meta?: string
	class?: string
}>(), {
	code: '',
	meta: '',
	language: 'text', // Nuxt Content 已经做了此处理
})

interface CodeblockMeta {
	icon?: string
	wrap?: boolean
	[meta: string]: string | boolean | undefined
}

const meta = computed(() => props.meta.split(' ').reduce((acc: CodeblockMeta, item) => {
	const [key, value] = item.split('=')
	acc[key!] = value ?? true
	return acc
}, {}))

const appConfig = useAppConfig()
const compConf = computed(() => appConfig.component.codeblock)

const rows = computed(() => props.code.split('\n').length - 1)
const collapsible = computed(() => !meta.value.expand && rows.value > compConf.value.triggerRows)
const [isCollapsed, toggleCollapsed] = useToggle(collapsible.value)

const icon = computed(() => meta.value.icon || getFileIcon(props.filename) || getLangIcon(props.language))
const isWrap = ref(meta.value.wrap)
const byteSize = computed(() => formatBytes(new TextEncoder().encode(props.code).length))
const preClass = computed(() => props.class?.split(' ').filter(className => !className.startsWith('language-')).join(' '))

const codeblock = useTemplateRef('codeblock')
const { copy, copied } = useCopy(codeblock)

const shikiStore = useShikiStore()
const rawHtml = ref(escapeHtml(props.code))

function getIndent() {
	if (meta.value.indent)
		return meta.value.indent

	if (['md', 'mdc', 'json', 'jsonc', 'yaml', 'yml'].includes(props.language))
		return 2

	return compConf.value.indent
}

onMounted(async () => {
	const debugStart = performance.now()
	const shiki = await shikiStore.load()
	await shikiStore.loadLang(props.language)
	const debugLoaded = performance.now()
	// 处理 Markdown 高亮内代码块中的语言
	// 加载 TeX 语言有概率导致 LaTeX 语言高亮炸掉
	if (props.language === 'markdown' || props.language.startsWith('md')) {
		const mdLangRegex = /^\s*`{3,}(\S+)/gm
		const langs = Array
			.from(props.code.matchAll(mdLangRegex))
			.map(match => match[1])
			.filter(lang => lang !== undefined)
		await shikiStore.loadLang(...langs)
	}

	rawHtml.value = shiki.codeToHtml(
		props.code.trimEnd(),
		shikiStore.getOptions(
			props.language,
			[compConf.value.enableIndentGuide ? 'ignoreRenderWhitespace' : 'ignoreRenderIndentGuides'],
			{ meta: { indent: getIndent() } },
		),
	)
	const debugHighlighted = performance.now()
	// #region debug-point A:render-styles
	requestAnimationFrame(() => {
		const pre = codeblock.value
		const line = pre?.querySelector('.line') as HTMLElement | null
		const before = line ? getComputedStyle(line, '::before') : null
		void fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'codeblock-rendering', runId: 'post-fix', hypothesisId: 'A', location: 'app/components/content/ProsePre.vue:55', msg: '[DEBUG] render-styles', data: { language: props.language, rows: rows.value, codeLength: props.code.length, rawHtmlLength: rawHtml.value.length, lineCount: pre?.querySelectorAll('.line').length, spanCount: pre?.querySelectorAll('span').length, loadMs: Math.round(debugLoaded - debugStart), highlightMs: Math.round(debugHighlighted - debugLoaded), rafMs: Math.round(performance.now() - debugHighlighted), totalMs: Math.round(performance.now() - debugStart), preClass: pre?.className, preBg: pre ? getComputedStyle(pre).backgroundColor : null, prePaddingInlineStart: pre ? getComputedStyle(pre).paddingInlineStart : null, preOverflow: pre ? getComputedStyle(pre).overflow : null, lineClass: line?.className, lineBg: line ? getComputedStyle(line).backgroundColor : null, lineDisplay: line ? getComputedStyle(line).display : null, lineBeforeContent: before?.content, lineBeforePosition: before?.position, lineBeforeBg: before?.backgroundColor, lineBeforeWidth: before?.width, lineBeforeColor: before?.color, lineBeforeLeft: before?.left, lineBeforeInsetInlineStart: before?.insetInlineStart }, ts: Date.now() }) }).catch(() => {})
	})
	// #endregion
})
</script>

<template>
<figure
	class="z-codeblock"
	:class="{ collapsed: collapsible && isCollapsed, collapsible }"
	:style="{
		'--collapsed-rows': compConf.collapsedRows,
		'--tab-size': meta.indent as string || compConf.tabSize,
	}"
>
	<figcaption>
		<span v-if="filename" class="filename">
			<Icon :name="icon" /> {{ filename }}
		</span>
		<span v-else />
		<span v-if="language" class="language">{{ language }}</span>
		<div class="operations">
			<button @click="isWrap = !isWrap">
				{{ isWrap ? '横向滚动' : '自动换行' }}
			</button>
			<button @click="copy()">
				{{ copied ? '已复制' : '复制' }}
			</button>
		</div>
	</figcaption>

	<pre
		ref="codeblock"
		class="shiki scrollcheck-x"
		:class="[preClass, { wrap: isWrap }]"
		v-html="rawHtml"
	/>

	<button
		v-if="collapsible"
		class="toggle-btn"
		:aria-label="isCollapsed ? '展开代码块' : '折叠代码块'"
		@click="toggleCollapsed()"
	>
		<Icon
			class="toggle-icon"
			:class="{ 'is-collapsed': isCollapsed }"
			name="tabler:chevrons-up"
		/>
		<span>{{ rows }} lines, {{ props.code.length }} chars, {{ byteSize }}</span>
	</button>
</figure>
</template>

<style lang="scss" scoped>
.z-codeblock {
	--line-height: 1.4;

	contain: paint;
	margin: 0.5em 0;
	border-radius: 0.5em;
	background-color: var(--c-bg-2);
	font-size: 0.85em;
	line-height: 1.4;
	tab-size: var(--tab-size, 4);

	&.collapsible > pre {
		padding-bottom: 0.5rem;
	}

	&.collapsed > pre {
		overflow: hidden;
		max-height: calc(var(--line-height) * var(--collapsed-rows) * 1em + 1rem);
		mask-image: linear-gradient(to top, transparent -2em, #FFF 4em);
		animation: none;
	}
}

figcaption {
	display: flex;
	justify-content: space-between;
	gap: 1em;
	position: sticky;
	top: 0;
	padding: 0 1em;
	z-index: 2;

	> .filename {
		padding: 0.2em 0.8em;
		border-radius: 0 0 0.5em 0.5em;
		background-color: var(--c-border);
		word-break: break-all;
	}

	> .language {
		opacity: 0.4;
		height: 0;
		transform: translateY(0.2em);
	}

	> .operations {
		position: absolute;
		opacity: 0;
		inset-inline-end: 0;
		padding: 0 0.6em;
		border-end-start-radius: 0.5em;
		background-color: var(--c-bg-2);
		transition: opacity 0.2s;

		:hover > &, :focus-within > & {
			opacity: 1;
		}

		> button {
			opacity: 0.4;
			padding: 0.2em 0.4em;
			transition: opacity 0.2s;

			&:hover {
				opacity: 1;
			}
		}
	}
}

pre {
	--start-offset: 4em;

	padding: 1rem;
	padding-inline-start: var(--start-offset);

	&.wrap {
		white-space: pre-wrap;
	}
}

:deep(.line) {
	&.diff {
		background-color: var(--ld-bg-active);

		&.add {
			--line-indicator: "+ ";
			--line-indicator-color: var(--c-success);
			--ld-bg-active: var(--c-success-soft);
		}

		&.remove {
			--line-indicator: "- ";
			--line-indicator-color: var(--c-error);
			--ld-bg-active: var(--c-error-soft);
		}
	}

	&.highlighted {
		--line-indicator-color: var(--c-text-1);

		background-color: var(--ld-bg-active);

		&.error {
			--line-indicator-color: var(--c-error);
			--ld-bg-active: var(--c-error-soft);
		}

		&.warning {
			--line-indicator-color: var(--c-warning);
			--ld-bg-active: var(--c-warning-soft);
		}
	}

	&.focused {
		--line-indicator: "→ ";
		--line-indicator-color: var(--c-text-1);

		display: inline-block;
		position: relative;
		box-shadow: 0 0 10rem 4rem var(--c-bg-2);
		transition: box-shadow 0.2s;

		@supports (color: color-mix(in srgb, transparent, transparent)) {
			box-shadow: 0 0 0 100vmax color-mix(in srgb, transparent, var(--c-bg-2));
		}

		pre:hover > & {
			box-shadow: none;
		}
	}

	&::before {
		content: var(--line-indicator, "") attr(data-line);
		position: fixed;
		inset-inline-start: 0;
		width: var(--start-offset);
		padding-inline-end: 1em;
		background-color: var(--c-bg-2);
		text-align: end;
		color: var(--line-indicator-color, var(--c-text-3));
		z-index: 1;
	}

	> .highlighted-word {
		border-radius: 0.2em;
		box-shadow: inset 0 0 0 1em var(--ld-bg-active);
	}
}

.toggle-btn {
	display: block;
	position: relative;
	opacity: 0.3;
	width: 100%;
	padding: 0.2em;
	background-color: var(--c-bg-3);
	transition: opacity 0.2s;

	&:hover {
		opacity: 1;
	}
}

.toggle-icon {
	margin-inline-end: 0.2em;
	transition: all 0.2s;

	&.is-collapsed {
		transform: rotate(180deg);
	}
}
</style>
