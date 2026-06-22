<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { FeedEntry } from '~/types/feed'

const props = defineProps<FeedEntry & { nofollow?: boolean }>()

const appConfig = useAppConfig()
const route = useRoute()
const isInspect = computed(() => import.meta.dev && route.query.inspect !== undefined)

const title = computed(() => props.title ?? props.sitenick ?? props.author)
const domainTip = computed(() => getDomainType(getMainDomain(props.link, true)))
const domainIcon = computed(() => getDomainIcon(props.link))
const latencyMs = computed(() => props.latency === undefined ? undefined : Math.round(props.latency * 1000))
const latencySeconds = computed(() => props.latency === undefined ? undefined : Math.round(props.latency * 10) / 10)
const statusTone = computed(() => {
	if (props.reachable === false || props.latency === undefined)
		return 'offline'
	if (props.latency > 3)
		return 'slow'
	if (props.latency > 1)
		return 'medium'
	return 'fast'
})
const statusLabel = computed(() => {
	if (props.reachable === false)
		return '离线'
	if (props.reachable && latencyMs.value !== undefined && latencyMs.value >= 0) {
		if (props.latency > 1)
			return `${latencySeconds.value?.toFixed(1)} S`

		return `${latencyMs.value} MS`
	}
})
const statusTip = computed(() => {
	if (props.reachable === false)
		return '最近检测不可达'
	if (statusLabel.value && latencyMs.value !== undefined) {
		if (props.latency > 1)
			return `最近检测可达，响应约 ${latencySeconds.value?.toFixed(1)} 秒`

		return `最近检测可达，响应约 ${latencyMs.value} ms`
	}
})
const statusStyle = computed<CSSProperties>(() => ({
	'--friend-status-delay': 'calc(var(--delay) + 0.2s)',
}))

function getInspectStyle(src: string): CSSProperties {
	src = getMainDomain(src)
	let color = 'red'

	if (src === getMainDomain(props.link))
		color = 'transparent' // 来自源站
	else if (src === 'webp.se')
		color = 'yellow' // 来自API获取
	else if (src === 'qlogo.cn')
		color = 'lightblue' // 来自QQ头像
	else if (src === ('wsrv.nl'))
		color = 'lightgreen' // 来自GitHub头像

	return {
		border: `2px solid ${color}`,
		boxSizing: 'content-box',
	}
}
</script>

<template>
<Tooltip :delay="200" interactive :hide-on-click="false">
	<UtilLink
		class="feed-card gradient-card"
		:to="error ? undefined : link"
		:data-error="error"
		:nofollow="nofollow"
	>
		<div class="avatar" :title="feed ? undefined : '无订阅源'">
			<template v-if="isInspect">
				<span style="position: absolute; left: 100%; white-space: nowrap;" v-text="title" />
				<NuxtImg v-if="icon" :src="icon" :title="icon" :style="getInspectStyle(icon)" width="40" height="40" />
				<NuxtImg v-if="avatar" :src="avatar" :title="avatar" :style="getInspectStyle(avatar)" width="40" height="40" />
			</template>

			<NuxtImg v-else-if="avatar" class="round-cobblestone" :src="avatar" :alt="author" loading="lazy" width="40" height="40" />
			<Icon v-show="appConfig.link.remindNoFeed && !feed" class="no-feed" name="ph:bell-simple-slash-bold" />
		</div>

		<span class="author">{{ author }}</span>
		<span class="sitenick">{{ sitenick }}</span>
		<span
			v-if="statusLabel"
			class="friend-status-tag"
			:class="`friend-status-tag--${statusTone}`"
			:title="statusTip"
			:aria-label="statusTip"
			:style="statusStyle"
		>
			<span class="friend-status-pulse" aria-hidden="true" />
			{{ statusLabel }}
		</span>
	</UtilLink>

	<template #content>
		<div class="site-content">
			<NuxtImg v-if="icon" class="site-icon" :src="icon" :alt="title" />

			<div class="site-info">
				<h3 class="text-creative">
					{{ title }}
				</h3>

				<code class="domain" :title="domainTip">
					<span>{{ getDomain(link) }}</span>
					<Icon v-if="domainIcon" class="domain-mark" :name="domainIcon" />
				</code>
			</div>

			<Icon
				v-for="arch in archs" :key="arch"
				class="arch" :name="getArchIcon(arch)" :title="arch"
			/>
		</div>
		<div class="desc-content">
			<div class="date">
				{{ date }}
			</div>

			<p>{{ error ?? desc }}</p>

			<p v-if="comment">
				<Icon name="ph:chat-centered-dots-bold" /> {{ comment }}
			</p>
		</div>
	</template>
</Tooltip>
</template>

<style lang="scss" scoped>
.feed-card {
	display: flex;
	align-items: center;
	gap: 0.2em;
	position: relative;
	width: 14em;
	margin: 1em auto;
	padding: 0.5em;
	line-height: 1.4;
	transition: transform 0.2s;
	animation: float-in 0.2s var(--delay) backwards;

	&:hover {
		transform: translateY(-2px);
	}

	&[data-error] {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.avatar {
		position: relative;
		margin: 0 0.5em 0 0;

		img {
			display: block;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 50%;
			box-shadow: 2px 4px 0.5em var(--ld-shadow);
			background-color: white;
			object-fit: cover;
		}

		.no-feed {
			position: absolute;
			inset-inline-end: -0.5em;
			bottom: 0;
		}
	}

	.author {
		overflow: hidden; // 长词折行
	}

	.sitenick {
		opacity: 0.4;
		font-size: 0.8em;
	}

	.no-feed {
		opacity: 0.6;
		font-size: 0.8em;
	}

	.friend-status-tag {
		--friend-status-color: #16A34A;

		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		position: absolute;
		inset-block-start: -0.45em;
		inset-inline-end: 0.45em;
		padding: 0.1em 0.45em;
		border: 1px solid color-mix(in srgb, var(--friend-status-color), transparent 55%);
		border-radius: 999px;
		box-shadow: 0 0.2em 0.8em color-mix(in srgb, var(--friend-status-color), transparent 75%);
		background: color-mix(in srgb, var(--friend-status-color), var(--c-bg) 86%);
		font-size: 0.65em;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 1.4;
		color: var(--friend-status-color);
		animation: float-in 0.2s var(--friend-status-delay) backwards;
	}

	.friend-status-pulse {
		flex: 0 0 auto;
		position: relative;
		width: 0.55em;
		height: 0.55em;
		border-radius: 50%;
		box-shadow: inset 0 0 0 0.1em color-mix(in srgb, currentcolor, transparent 30%);
		background: color-mix(in srgb, currentcolor, transparent 36%);

		&::after {
			content: "";
			position: absolute;
			inset: 0.08em;
			border-radius: 50%;
			background: currentcolor;
		}
	}

	.friend-status-tag--offline {
		--friend-status-color: #DC2626;

		box-shadow: 0 0.2em 0.8em color-mix(in srgb, var(--friend-status-color), transparent 80%);
		background: color-mix(in srgb, var(--friend-status-color), var(--c-bg) 88%);
	}

	.friend-status-tag--medium {
		--friend-status-color: #2563EB;
	}

	.friend-status-tag--slow {
		--friend-status-color: #EAB308;
	}
}

// https://vue-tippy.netlify.app/props#appendto
// Tooltip 位于组件根部时，interactive tippy 会插入到父组件
:deep() ~ [data-tippy-root] > .tippy-box {
	overflow: hidden;
	overflow: clip;
	padding: 0;

	&[data-placement="top"] > .tippy-svg-arrow {
		fill: var(--c-bg-1);
	}
}

.site-content {
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 0.5em 1em;

	.site-icon {
		width: 1.5rem;
		height: 1.5rem;
		min-width: 1.5rem;
		min-height: 1.5rem;
		border-radius: 4px;
		object-fit: contain;
	}

	.site-info {
		flex: 1;
		margin-inline-end: 0.5em;

		.domain {
			font-size: 0.9em;
		}

		.domain-mark {
			font-size: 0.8em;
			vertical-align: super;
		}
	}
}

.desc-content {
	position: relative;
	padding: 0.5em 1em;
	background-color: var(--c-bg-1);

	p + p {
		margin-top: 0.5em;
	}

	.date {
		position: absolute;
		opacity: 0.1;
		inset-inline-end: -0.1em;
		bottom: -0.3em;
		font-size: 3em;
		font-weight: bold;
		white-space: nowrap;
		pointer-events: none;
	}
}
</style>
