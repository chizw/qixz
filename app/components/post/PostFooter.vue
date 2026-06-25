<script setup lang="ts">
import type ArticleProps from '~/types/article'
import { ZButton } from '#components'

defineOptions({ inheritAttrs: false })

const props = defineProps<ArticleProps>()
const appConfig = useAppConfig()
const { donation } = appConfig
const BAYI_CLOUD_URL = 'https://um.qixz.cn/q/iPBg8UYFH'
const title = `${props.title} | ${appConfig.title}`
const href = props.path ? new URL(props.path, appConfig.url).href : appConfig.url
const { copy, copied } = useCopy(href)
</script>

<template>
<div class="post-footer">
	<section v-if="references" class="reference">
		<div id="references" class="title text-creative">
			参考链接
		</div>

		<div class="content">
			<ul>
				<li v-for="{ title: refTitle, link }, i in references" :key="i">
					<ProseA :href="link || ''">
						{{ refTitle ?? link }}
					</ProseA>
				</li>
			</ul>
		</div>
	</section>

	<section class="license">
		<div class="title text-creative">
			许可协议
		</div>

		<div class="content">
			<p>
				本文采用 <ProseA :href="appConfig.copyright.url">
					{{ appConfig.copyright.name }}
				</ProseA>
				许可协议，转载请注明出处。
			</p>
		</div>
	</section>

	<section class="share">
		<div class="title text-creative">
			分享文章
		</div>

		<div class="content">
			<ZButton
				v-tip="'QQ'"
				class="share-button"
				icon="ri:qq-line"
				:to="`https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(title)}&url=${encodeURIComponent(href)}`"
			/>
			<ZButton
				v-tip="'微博'"
				class="share-button"
				icon="ri:weibo-fill"
				:to="`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(href)}`"
			/>
			<ZButton
				v-tip="'邮件'"
				class="share-button"
				icon="ph:envelope-simple-bold"
				:to="`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(href)}`"
			/>
			<ZButton
				v-tip="{
					content: copied ? '已复制链接' : '复制链接',
					hideOnClick: false,
				}"
				class="share-button"
				icon="ph:link"
				@click="copy()"
			/>
			<div class="action-right">
				<Tooltip :delay="200" interactive placement="top" max-width="">
					<UtilLink class="promotion-card" :to="BAYI_CLOUD_URL" target="_blank">
						<Icon class="promotion-icon" name="ph:cloud-bold" />
						<span class="promotion-info">
							<strong>八壹云</strong>
							<small>高性价比云服务</small>
						</span>
						<Icon class="promotion-arrow" name="ph:arrow-right-bold" />
					</UtilLink>
					<template #content>
						<div class="promotion-popover">
							<div class="popover-header">
								<Icon name="ph:cloud-bold" />
								<span>八壹云</span>
							</div>
							<p class="popover-desc">稳定可靠的高性价比云服务提供商</p>
							<div class="popover-features">
								<span><Icon name="ph:hard-drives-bold" /> 弹性云服务器</span>
								<span><Icon name="ph:cloud-bold" /> 轻量应用服务器</span>
								<span><Icon name="ph:shield-check-bold" />香港高防黑洞秒解</span>
								<span><Icon name="ph:hand-heart-bold" />站长资助计划</span>
							</div>
							<UtilLink class="popover-cta" :to="BAYI_CLOUD_URL" target="_blank">
								立即了解
								<Icon name="ph:arrow-right-bold" />
							</UtilLink>
						</div>
					</template>
				</Tooltip>
				<div class="donate-container">
				<UtilHydrateSafe>
					<Tooltip v-if="donation?.enable" :delay="200" interactive :hide-on-click="false" max-width="">
						<ZButton class="donate-button" icon="ph:heart-fill" text="赞赏作者" />
						<template #content>
							<div class="donation-content">
								<div v-if="Object.keys(donation.items).length" class="donation-list">
									<figure v-for="(image, label) in donation.items" :key="label" class="donation-item">
										<UtilImg class="image" width="160" height="160" :src="image" />
										<figcaption class="label">
											{{ label }}
										</figcaption>
									</figure>
								</div>
								<p v-if="donation.message" class="donation-message">
									{{ donation.message }}
								</p>
							</div>
						</template>
					</Tooltip>
				</UtilHydrateSafe>
			</div>
			</div>
		</div>
	</section>
</div>
</template>

<style lang="scss" scoped>
.post-footer {
	margin: 2rem 0.5rem;
	border: 1px solid var(--c-border);
	border-radius: 1rem;
	background-color: var(--c-bg-2);
}

section {
	padding: 1rem;

	& + section {
		border-top: 1px solid var(--c-border);
	}
}

.title {
	font-weight: bold;
	color: var(--c-text);
}

.content {
	margin-top: 0.5em;
	font-size: 0.9rem;

	li {
		margin: 0.5em 0;
	}
}

.content {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
}

.donate-container {
	margin-left: auto;
}

.donate-button {
	padding: 0.6rem 0.8rem;
	border: 1px solid var(--c-border);
	box-shadow: none;
}

.donation-content {
	padding: 0.5rem 0.6rem;
	text-align: center;

	.donation-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		padding: 0.5rem 0;
	}

	.donation-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		.image {
			border-radius: 0.5rem;
			object-fit: cover;
		}

		.label {
			color: var(--c-text-2);
		}
	}

	.donation-message {
		color: var(--c-text-1);
	}
}

.action-right {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-left: auto;
}

.promotion-card {
	display: inline-flex;
	align-items: center;
	gap: 0.5em;
	padding: 0.5em 0.8em;
	border: 1px solid var(--c-border);
	border-radius: 0.6em;
	text-decoration: none;
	transition: border-color 0.2s, background-color 0.2s;

	&:hover {
		border-color: var(--c-primary);
		background-color: var(--c-bg-soft);
	}
}

.promotion-icon {
	flex-shrink: 0;
	font-size: 1.4em;
	color: var(--c-primary);
}

.promotion-info {
	display: flex;
	flex-direction: column;
	gap: 0.1em;
	line-height: 1.2;

	strong {
		color: var(--c-text);
		font-size: 0.85em;
	}

	small {
		color: var(--c-text-3);
		font-size: 0.7em;
	}
}

.promotion-arrow {
	flex-shrink: 0;
	font-size: 0.85em;
	color: var(--c-text-3);
	transition: color 0.2s, transform 0.2s;

	.promotion-card:hover & {
		color: var(--c-primary);
		transform: translateX(0.15em);
	}
}

.promotion-popover {
	padding: 0.8rem;
	font-size: 0.85rem;
	line-height: 1.4;
}

.popover-header {
	display: flex;
	align-items: center;
	gap: 0.4em;
	font-size: 1.1em;
	font-weight: 600;
	color: var(--c-text);

	.iconify {
		color: var(--c-primary);
		font-size: 1.3em;
	}
}

.popover-desc {
	margin: 0.4em 0 0.6em;
	color: var(--c-text-2);
}

.popover-features {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.35em;
	margin-bottom: 0.8em;

	span {
		display: flex;
		align-items: center;
		gap: 0.3em;
		color: var(--c-text-2);

		.iconify {
			color: var(--c-primary);
			font-size: 0.95em;
		}
	}
}

.popover-cta {
	display: inline-flex;
	align-items: center;
	gap: 0.3em;
	padding: 0.4em 1em;
	border-radius: 0.5em;
	background-color: var(--c-primary);
	color: var(--c-bg);
	font-weight: 500;
	text-decoration: none;
	transition: opacity 0.2s;

	&:hover {
		opacity: 0.85;
	}
}

:deep([data-tippy-root]) {
	max-width: calc(100% - 1rem);

	.tippy-box {
		border: 1px solid var(--c-border);
		background-color: var(--c-bg-2);
		box-shadow: 0 4px 12px var(--ld-shadow);
	}

	.tippy-svg-arrow {
		fill: var(--c-bg-2);
	}
}
</style>
