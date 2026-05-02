<script setup lang="ts">
import type { TalkItem } from '../types/talk'
import { toDate } from 'date-fns-tz'
import { onMounted, ref } from 'vue'
import { fetchTalks } from '../talks'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log', 'comm-group'])

const title = '说说：记录生活点滴，一些想法'
const description = '记录生活点滴，一些想法。'
const image = 'https://s3.qixz.cn/ywty/2026/04/19/69e44174e38dd.webp'
useSeoMeta({ title, description, ogImage: image })

const { author } = useAppConfig()

const recentTalks = ref<TalkItem[]>([])
const isLoading = ref(true)
const loadError = ref(false)
const hasMore = ref(true)

async function loadTalks(showLoading = true) {
	if (showLoading) {
		isLoading.value = true
		loadError.value = false
	}

	try {
		const talks = await fetchTalks()
		const sortedTalks = [...talks]
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 30)

		recentTalks.value = sortedTalks
		hasMore.value = sortedTalks.length >= 30
	}
	catch (error) {
		console.error('获取说说数据失败:', error)
		loadError.value = true
	}
	finally {
		if (showLoading) {
			isLoading.value = false
		}
	}
}

onMounted(async () => {
	loadTalks()
})

function replyTalk(content?: string): void {
	const input = document.querySelector('#twikoo .tk-input textarea')
	if (!(input instanceof HTMLTextAreaElement))
		return

	if (content?.trim()) {
		const quotes = content.split('\n').map(str => `> ${str}`)
		input.value = `${quotes}\n\n`
	}
	else {
		input.value = ''
	}
	input.dispatchEvent(new InputEvent('input'))

	const length = input.value.length
	input.setSelectionRange(length, length)
	input.focus()
}

function getEssayDate(date?: string | Date) {
	if (!date) {
		return ''
	}

	const appConfig = useAppConfig()
	return toDate(date, { timeZone: appConfig.timezone })
		.toLocaleString(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		})
		.replace(/\//g, '-')
}
</script>

<template>
<ZPageBanner :title :description :image />

<div class="talk-list">
	<!-- 加载状态 -->
	<template v-if="isLoading">
		<div class="loading-state">
			<div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton">
				<div class="skeleton-meta">
					<div class="skeleton-avatar" />
					<div class="skeleton-info">
						<div class="skeleton-nick" />
						<div class="skeleton-date" />
					</div>
				</div>
				<div class="skeleton-content">
					<div class="skeleton-text" />
					<div class="skeleton-text" />
					<div class="skeleton-text" />
				</div>
				<div class="skeleton-bottom">
					<div class="skeleton-tags" />
				</div>
			</div>
		</div>
	</template>

	<!-- 错误状态 -->
	<template v-else-if="loadError">
		<div class="error-state">
			<div class="error-content">
				<Icon name="ph:alert-circle-bold" class="error-icon" />
				<h3>加载失败</h3>
				<p>获取说说数据时出现错误，请稍后重试</p>
				<button class="retry-btn" @click="() => loadTalks()">
					<Icon name="ph:refresh-bold" />
					重试
				</button>
			</div>
		</div>
	</template>

	<!-- 内容状态 -->
	<template v-else>
		<!-- 空状态 -->
		<div v-if="recentTalks.length === 0" class="empty-state">
			<Icon name="ph:chat-circle-bold" class="empty-icon" />
			<p>暂无说说内容</p>
		</div>

		<!-- 内容列表 -->
		<transition-group v-else name="talk-fade" tag="div">
			<div v-for="talk in recentTalks" :key="talk.id || talk.date" class="talk-item">
				<div class="talk-meta">
					<NuxtImg class="avatar" :src="author.avatar" :alt="author.name" width="48" height="48" />
					<div class="info">
						<div class="nick">
							{{ author.name }}
							<Icon class="verified" name="i-material-symbols:verified" />
						</div>
						<div class="date">
						<ClientOnly>
							{{ getEssayDate(talk.date) }}
						</ClientOnly>
					</div>
					</div>
				</div>

				<div class="talk-content">
					<div v-if="talk.text" class="text" v-html="talk.text" />
					<div v-if="talk.images?.length" class="images">
						<Pic v-for="(img, imgIndex) in talk.images" :key="imgIndex" class="image" :src="img" />
					</div>
					<a v-if="talk.music?.url" :href="talk.originalUrl || talk.music.url" target="_blank" rel="noopener" class="music-link">
					<Icon name="ph:music-notes-bold" />
					<span>{{ talk.music.title || '音乐' }}</span>
				</a>
					<VideoEmbed v-if="talk.video" class="video" v-bind="talk.video" height="" />
					<LocationCard v-if="talk.location" class="location-card" v-bind="talk.location" />
					<GithubCard v-if="talk.github" class="github-card" v-bind="talk.github" />
					<LinkCard v-if="talk.link" class="link" :link="talk.link.url" :title="talk.link.title || ''" :description="talk.link.description" :icon="talk.link.image" :favicon="talk.link.favicon" />
				</div>

				<div class="talk-bottom">
					<div class="tags">
						<span v-for="tag in talk.tags" :key="tag" class="tag">
							<Icon name="ph:tag-bold" />
							<span>{{ tag }}</span>
						</span>
					</div>
					<button v-tip="'评论'" class="comment-btn" @click="replyTalk(talk.text)">
						<Icon name="ph:chat-circle-bold" />
					</button>
				</div>
			</div>
		</transition-group>

		<div class="talk-footer">
			<p>仅显示最近 30 条记录</p>
		</div>
	</template>
</div>

<PostComment />
</template>

<style lang="scss" scoped>
.talk-list {
	margin: 1rem;
	animation: float-in 0.2s backwards;

	.talk-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		opacity: 1;
		margin-bottom: 1rem;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		transform: translateY(0);
		transition: opacity 0.3s ease, transform 0.3s ease;
		animation: float-in 0.3s backwards;
		animation-delay: var(--delay);

		.talk-meta {
			display: flex;
			align-items: center;
			gap: 10px;

			.avatar {
				width: 3em;
				border-radius: 2em;
				box-shadow: 2px 4px 1rem var(--ld-shadow);
			}

			.nick {
				display: flex;
				align-items: center;
				gap: 5px;
			}

			.date {
				font-family: var(--font-monospace);
				font-size: 0.8rem;
				color: var(--c-text-3);
			}

			.verified {
				font-size: 16px;
				color: var(--c-primary);
			}
		}

		.talk-content {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			line-height: 1.6;
			color: var(--c-text-2);

			:deep(a[href]) {
				margin: -0.1em -0.2em;
				padding: 0.1em 0.2em;
				background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
				color: var(--c-primary);
				transition: all 0.2s;

				&:hover {
					border-radius: 0.3em;
					background-size: 100% 100%;
				}
			}

			.images {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 8px;
			}

			.image {
				position: relative;
				overflow: hidden;
				padding-bottom: 100%;
				border-radius: 8px;

				:deep(img) {
					position: absolute;
					width: 100%;
					height: 100%;
					transition: transform 0.3s;
					object-fit: cover;

					&:hover {
						transform: scale(1.05);
					}
				}
			}

			.video {
				margin: 0;
				border-radius: 8px;
			}

			.music-link {
				display: inline-flex;
				gap: 0.3rem;
				align-items: center;
				padding: 0.3rem 0.6rem;
				border-radius: 0.3rem;
				background: var(--c-bg-soft);
				font-size: 0.8rem;
				color: var(--c-primary);
				text-decoration: none;
				transition: all 0.2s;

				&:hover {
					background: var(--c-primary-soft);
				}
			}

			.link {
				width: 100%;
				max-width: 400px;
				margin: 0.5rem auto;
			}

			.location-card,
			.github-card {
				margin: 0.5rem 0;
			}
		}

		.talk-bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--c-text-3);

			.tags {
				display: flex;
				flex-wrap: wrap;
				gap: 4px;
				font-size: 0.7rem;
			}

			.tag {
				display: flex;
				align-items: center;
				padding: 2px 4px;
				border-radius: 4px;
				background-color: var(--c-bg-2);
			}

			.tag .i-ph\:tag-bold + * {
				margin-left: 0.15em;
			}

			.comment-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.4rem;
				border: none;
				border-radius: 0.4rem;
				background: transparent;
				font-size: 1rem;
				color: var(--c-text-3);
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background: var(--c-bg-2);
					color: var(--c-primary);
				}
			}
		}
	}

	.talk-footer {
		margin: 2rem 0;
		font-size: 1rem;
		text-align: center;
		color: var(--c-text-3);
	}

	/* 过渡动画 */
	.talk-fade-enter-active,
	.talk-fade-leave-active {
		transition: all 0.3s ease;
	}

	.talk-fade-enter-from {
		opacity: 0;
		transform: translateY(20px);
	}

	.talk-fade-leave-to {
		opacity: 0;
		transform: translateY(-20px);
	}

	/* 加载状态 */
	.loading-state {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem 0;
	}

	.skeleton {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
	}

	.skeleton-meta {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.skeleton-avatar {
		width: 3em;
		height: 3em;
		border-radius: 50%;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-info {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0.3rem;
	}

	.skeleton-nick {
		width: 120px;
		height: 18px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-date {
		width: 100px;
		height: 14px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.skeleton-text {
		height: 16px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-text:nth-child(2) {
		width: 80%;
	}

	.skeleton-text:nth-child(3) {
		width: 60%;
	}

	.skeleton-bottom {
		height: 24px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	/* 错误状态 */
	.error-state {
		margin: 1rem 0;
		padding: 3rem 1rem;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		text-align: center;
	}

	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.error-icon {
		font-size: 3rem;
		color: var(--c-primary);
	}

	.error-state h3 {
		margin: 0;
		font-size: 1.2rem;
		color: var(--c-text-1);
	}

	.error-state p {
		margin: 0;
		color: var(--c-text-3);
	}

	.retry-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		background-color: var(--c-primary);
		font-size: 0.9rem;
		color: white;
		transition: all 0.2s;
		cursor: pointer;

		&:hover {
			background-color: var(--c-primary-hover);
			transform: translateY(-1px);
		}

		&:active {
			transform: translateY(0);
		}
	}

	/* 空状态 */
	.empty-state {
		margin: 1rem 0;
		padding: 3rem 1rem;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		text-align: center;
		color: var(--c-text-3);
	}

	.empty-icon {
		margin-bottom: 0.5rem;
		font-size: 3rem;
	}

	/* 加载动画 */
	@keyframes loading {
		0% {
			background-position: 200% 0;
		}

		100% {
			background-position: -200% 0;
		}
	}

	/* 淡入动画 */
	@keyframes float-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
}
</style>
