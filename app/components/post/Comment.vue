<script setup lang="ts">
const props = withDefaults(defineProps<{
	path?: string
	title?: string
	placeholder?: string
}>(), {
	title: '评论区',
})

const appConfig = useAppConfig()
const route = useRoute()

const status = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')
const normalizedPath = computed(() => props.path || route.path)
const commentId = computed(() => `twikoo-${normalizedPath.value.replace(/[^\w-]/g, '-').replace(/^-+|-+$/g, '') || 'root'}`)

const COMMENT_FALLBACK_IMG = 'https://s3.qixz.cn/ywty/2026/06/20/6a366d2bcda01.webp'

let retryTimer: ReturnType<typeof setTimeout> | undefined
let imgObserver: MutationObserver | undefined

function bindCommentImageFallback(container: HTMLElement) {
	const images = container.querySelectorAll('img')
	images.forEach((img) => {
		if (img.dataset.fallbackBound)
			return
		img.dataset.fallbackBound = '1'
		img.addEventListener('error', () => {
			if (img.src !== COMMENT_FALLBACK_IMG)
				img.src = COMMENT_FALLBACK_IMG
		}, { once: true })
	})
}

function observeCommentImages(container: HTMLElement) {
	bindCommentImageFallback(container)
	imgObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node instanceof HTMLElement)
					bindCommentImageFallback(node)
			}
		}
	})
	imgObserver.observe(container, { childList: true, subtree: true })
}

async function initTwikoo(retry = 0) {
	if (!import.meta.client)
		return

	status.value = 'loading'
	errorMessage.value = ''

	const envId = appConfig.twikoo?.envId
	if (!envId) {
		status.value = 'error'
		errorMessage.value = '评论服务配置不可用，请稍后再试。'
		return
	}

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
		})
		status.value = 'ready'
		const host = document.getElementById(commentId.value)
		if (host)
			observeCommentImages(host)
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
	if (imgObserver)
		imgObserver.disconnect()
})
</script>

<template>
<section id="twikoo" class="z-comment">
	<h3 class="text-creative">
		{{ props.title }}
	</h3>
	<div class="comment-panel">
		<div v-if="status === 'loading'" class="comment-state">
			<div class="loading-spinner" />
			<p>评论加载中...</p>
		</div>
		<div v-else-if="status === 'error'" class="comment-state is-error">
			<Icon name="solar:confounded-square-bold-duotone" />
			<p>{{ errorMessage }}</p>
		</div>
		<div :id="commentId" class="twikoo-host" :data-placeholder="placeholder" />
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
	position: relative;
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

	.icon {
		font-size: 2rem;
		color: var(--c-primary);
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--c-bg-3);
		border-top-color: var(--c-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	p { font-size: 0.9rem; }

	&.is-error {
		border: 1px dashed var(--c-border);
		border-radius: 0.75rem;
		background: var(--c-bg-2);
	}
}

.twikoo-host {
	min-height: 2rem;
}

:deep(.twikoo-host) {
	.tk-admin-container {
		position: fixed;
		z-index: 1;
	}

	.tk-avatar {
		overflow: hidden;
		border-radius: 50%;
		box-shadow: 2px 4px 0.5em var(--ld-shadow);
		background-color: white;
	}

	.tk-submit {
		display: flex;
		flex-direction: column;
		padding: 0.25rem 0 1rem;

		.tk-avatar,
		a.tk-submit-action-icon.__markdown { display: none; }

		.tk-preview-container { margin: 0 0 0.5rem; }

		.tk-row.actions {
			align-items: center;
			justify-content: flex-end;
			gap: 0.5rem;
			order: 3;
			margin: 0 0 0.5rem;
		}

		.tk-input {
			order: 1;
			margin-bottom: 0.5rem;
			font-family: var(--font-monospace);

			.el-textarea-inner {
				padding: 0.8rem;
				border: 2px solid var(--c-border);
				border-radius: 12px;
				background-color: var(--c-bg-2);
				transition: all 0.2s;

				&:focus {
					border-color: var(--c-primary);
					background-color: var(--c-bg);
					background-position-y: 350px;
				}
			}
		}

		.tk-meta-input {
			order: 2;
			position: relative;

			.el-input-group {
				border: 2px solid var(--c-border);
				border-radius: 10px;
				background: var(--c-bg-2);
				transition: all 0.2s;

				&:focus-within {
					border-color: var(--c-primary);
					background: var(--c-bg);

					&::before, &::after {
						display: block;
						animation: fade-in-tip 0.3s ease;
					}
				}

				&::before {
					display: none;
					position: absolute;
					top: -60px;
					left: 50%;
					padding: 0.8rem 1rem;
					border: 1px solid var(--c-border);
					border-radius: 8px;
					background: var(--c-bg);
					font-size: 0.9rem;
					white-space: nowrap;
					color: var(--c-text-1);
					transform: translate(-50%);
					z-index: 100;
				}

				&::after {
					content: "";
					display: none;
					position: absolute;
					top: -12px;
					left: 50%;
					border: 8px solid transparent;
					border-top: 8px solid var(--c-bg);
					transform: translate(-50%);
				}
			}

			.el-input-group:first-child::before { content: "输入QQ号会自动获取昵称和头像🐧"; }
			.el-input-group:nth-child(2)::before { content: "收到回复将会发送到您的邮箱📧"; }
			.el-input-group:nth-child(3)::before { content: "可以通过昵称访问您的网站🔗"; }

			.el-input__inner { border: none; }

			.el-input-group-prepend {
				border: none;
				border-radius: 8px 0 0 8px;
				background: var(--c-bg-1);
				color: var(--c-text-2);
				transition: all 0.2s;
			}
		}
	}

	.owo .owo-body {
		border-radius: 8px;
		background: var(--c-bg);
		transform: translateZ(0);
		animation: fade-in-panel 0.3s ease 0.1s 1 normal both;
	}

	.tk-content {
		margin-top: 0.1rem;
		font-size: 0.95rem;
		line-height: 1.6;

		.tk-owo-emotion {
			width: auto;
			height: 4.2em;
			margin: 0 0.2em;
			vertical-align: middle;
		}

		a {
			margin: 0 -0.1em;
			padding: 0 0.1em;
			background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat bottom/100% 0.1em;
			color: var(--c-primary);
			transition: all 0.2s;

			&:hover {
				border-radius: 0.3em;
				background-size: 100% 100%;
			}
		}

		p > code, > code {
			padding: 0.2em 0.4em;
			border: 1px solid var(--c-border);
			border-radius: 6px;
			background: var(--c-bg-2);
		}

		.code-toolbar, > span > pre {
			position: relative;
			overflow: auto;
			padding: 0.4rem;
			border: 2px solid var(--c-border);
			border-radius: 8px;
			background: var(--c-bg-2);

			&::before { display: none; }

			pre {
				margin-top: 0.75rem;

				code {
					display: block;
					padding-top: 0.75rem;
				}
			}
		}
	}

	.tk-comments-title, .tk-nick > strong {
		margin-bottom: 0;
		font-family: var(--font-creative);
	}

	.tk-comments-title {
		padding-top: 0.5rem;
		border-top: 1px solid var(--c-border);
	}

	.tk-comment {
		padding: 1rem 0;
		border-bottom: 1px solid var(--c-border);

		&:last-child { border-bottom: none; }
	}

	.tk-replies:not(.tk-replies-expand) {
		mask-image: linear-gradient(#FFF 50%, transparent);
	}

	.tk-expand,
	.tk-collapse,
	.tk-load-more,
	.tk-comments-more,
	[class*="expand"],
	[class*="more"] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		min-height: 2.25rem;
		margin: 0.35rem auto;
		padding: 0.4rem 1rem;
		border: 1px solid var(--c-border);
		border-radius: 999px;
		box-shadow: 1px 2px 0.35em var(--ld-shadow);
		background: var(--c-bg-2);
		font-size: 0.85rem;
		line-height: 1.2;
		color: var(--c-text-1);
		transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s, color 0.2s, transform 0.2s;
		cursor: pointer;

		&::after {
			content: "";
			width: 0.45em;
			height: 0.45em;
			border-right: 2px solid currentcolor;
			border-bottom: 2px solid currentcolor;
			transform: translateY(-0.1em) rotate(45deg);
			transition: transform 0.2s;
		}

		&:hover {
			border-color: var(--c-primary);
			box-shadow: 2px 4px 0.5em var(--ld-shadow);
			background: var(--c-bg-3);
			color: var(--c-primary);
			transform: translateY(-1px);
		}

		&:active {
			box-shadow: 1px 2px 0.25em var(--ld-shadow);
			transform: translateY(0);
		}
	}

	.tk-replies-expand + .tk-expand,
	.tk-replies-expand ~ .tk-expand,
	[class*="collapse"] {
		&::after {
			transform: translateY(0.1em) rotate(225deg);
		}
	}

	.tk-nick-link { color: var(--c-primary); }

	.tk-comment .tk-main {
		margin-top: -0.1rem;

		.tk-meta { margin-bottom: 0.3rem; }

		.tk-extras {
			margin-top: 0.5rem;
			font-size: 0.85rem;
			color: var(--c-text-2);
		}
	}

	.tk-preview, .tk-cancel {
		border: 1px solid var(--c-border);
		border-radius: 8px;
		background-color: var(--c-bg-2);
		color: var(--c-text-1);

		&:hover {
			border-color: var(--c-primary);
			background-color: var(--c-bg-3);
		}
	}

	.tk-send {
		border: 1px solid var(--c-primary);
		border-radius: 8px;
		background-color: var(--c-primary);
		color: white;

		&:hover {
			border-color: var(--c-primary-soft);
			background-color: var(--c-primary-soft);
		}
	}

	.tk-time { color: var(--c-text-3); }

	.tk-extras, .tk-footer {
		font-size: 0.7rem;
		color: var(--c-text-3);
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

	:deep(.twikoo-host) {
		.tk-submit .tk-meta-input .el-input-group {
			&::before, &::after { content: none; }
		}

		.tk-comment {
			padding: 0.875rem 0;
		}

		.tk-avatar {
			width: 2.25rem;
			height: 2.25rem;
		}
	}
}

:deep(:where(.tk-preview-container, .tk-content)) {
	pre {
		overflow: auto;
		border-radius: 0.5rem;
		font-size: 0.8125rem;
	}
	p { margin: 0.2em 0; }
	img { border-radius: 0.5em; }

	menu, ol, ul {
		margin: 0.5em 0;
		padding-inline-start: 1.5em;
		font-size: 0.9rem;
		list-style: revert;

		> li {
			margin: 0.2em 0;
			&::marker { color: var(--c-primary); }
		}
	}

	blockquote {
		margin: 0.5rem 0 0.8rem;
		padding: 0.8rem;
		border-left: 4px solid var(--c-border);
		border-radius: 8px;
		background: var(--c-bg-2);
		font-size: 0.9rem;
		color: var(--c-text-2);
		transition: all 0.2s;
	}
}

@keyframes spin {
	0% { transform: rotate(0); }
	100% { transform: rotate(1turn); }
}

@keyframes fade-in-tip {
	from {
		opacity: 0;
		transform: translate(-50%, 10px);
	}

	to {
		opacity: 1;
		transform: translate(-50%);
	}
}

@keyframes fade-in-panel {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
