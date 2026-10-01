<script setup lang="ts">
const props = withDefaults(defineProps<{
	path?: string
	title?: string
}>(), {
	title: '评论区',
})

const appConfig = useAppConfig()
const route = useRoute()

const status = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')
const normalizedPath = computed(() => props.path || route.path)
const commentId = computed(() => `twikoo-${normalizedPath.value.replace(/[^\w-]/g, '-').replace(/^-+|-+$/g, '') || 'root'}`)

let retryTimer: ReturnType<typeof setTimeout> | undefined

async function initTwikoo(retry = 0) {
	if (!import.meta.client)
		return

	const envId = appConfig.twikoo?.envId
	if (!envId) {
		status.value = 'error'
		errorMessage.value = '评论服务配置不可用，请稍后再试。'
		return
	}

	// v2 的脚本由 <head> 中的 CDN 引入，需要等待其就绪
	if (!window.twikoo?.init) {
		if (retry < 20) {
			retryTimer = setTimeout(initTwikoo, 300, retry + 1)
			return
		}

		status.value = 'error'
		errorMessage.value = '评论资源加载失败，请刷新页面重试。'
		return
	}

	try {
		await nextTick()
		await window.twikoo.init({
			envId,
			el: `#${commentId.value}`,
			path: normalizedPath.value,
			// 评论区的 Prism 高亮默认走 jsDelivr，这里换成站点自建镜像
			prismCdn: 'https://fastjs.qixz.cn/npm/prismjs@1.28.0',
		})
		status.value = 'ready'
	}
	catch {
		status.value = 'error'
		errorMessage.value = '评论区初始化失败，请稍后再试。'
	}
}

onMounted(() => {
	initTwikoo()
})

onBeforeUnmount(() => {
	if (retryTimer)
		clearTimeout(retryTimer)
})
</script>

<template>
<section id="comments" class="z-comment">
	<h3 class="text-creative">
		{{ props.title }}
	</h3>
	<div class="comment-panel">
		<div :id="commentId" class="twikoo-host" />
		<div v-if="status !== 'ready'" class="comment-state">
			<div v-if="status === 'loading'" class="loading-spinner" />
			<p>{{ status === 'loading' ? '评论加载中...' : errorMessage }}</p>
		</div>
	</div>
</section>
</template>

<style lang="scss" scoped>
.z-comment {
	margin: 2rem auto;
	padding: 0 1rem;
	scroll-margin-top: 5rem;

	> h3 {
		margin-top: 3rem;
		font-size: 1.25rem;
	}
}

.comment-panel {
	margin-top: 1rem;
	padding: 1rem;
	border: 2px solid var(--c-border);
	border-radius: 1rem;
	box-shadow: 2px 4px 0.5em var(--ld-shadow);
	background: var(--c-bg);
}

.comment-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	padding: 2rem;
	text-align: center;
	color: var(--c-text-2);

	p { font-size: 0.9rem; }

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid var(--c-bg-3);
		border-top-color: var(--c-primary);
		border-radius: 50%;
		animation: twikoo-spin 1s linear infinite;
	}
}

@media (max-width: 720px) {
	.z-comment {
		padding: 0 0.75rem;
	}

	.comment-panel {
		padding: 0.75rem;
		border-radius: 0.875rem;
	}
}

@keyframes twikoo-spin {
	0% { transform: rotate(0); }
	100% { transform: rotate(1turn); }
}
</style>
