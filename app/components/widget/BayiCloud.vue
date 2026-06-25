<script setup lang="ts">
const BAYI_CLOUD_URL = 'https://um.qixz.cn/q/iPBg8UYFH'
</script>

<template>
<BlogWidget card title="八壹云">
	<div class="bayi-cloud">
		<p class="desc">
			稳定、高性价比的云服务提供商
		</p>
		<ul class="features">
			<li>弹性云服务器</li>
			<li>轻量应用服务器</li>
			<li>香港高防无黑洞秒解</li>
			<li>站长资助计划</li>
		</ul>
		<UtilLink :to="BAYI_CLOUD_URL" class="cta" target="_blank">
			<Icon name="ph:arrow-square-out-bold" />
			立即了解
		</UtilLink>
	</div>
</BlogWidget>
</template>

<style lang="scss" scoped>
.bayi-cloud {
	.desc {
		color: var(--c-text-2);
		line-height: 1.6;
	}

	.features {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4em;
		margin: 0.5em 0;
		list-style: none;

		li {
			padding: 0.2em 0.6em;
			border-radius: 0.4em;
			background-color: var(--c-bg-soft);
			font-size: 0.85em;
			color: var(--c-text-2);
		}
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		padding: 0.4em 0.8em;
		margin-top: 0.3em;
		border-radius: 0.5em;
		background-color: var(--c-primary);
		color: var(--c-bg);
		font-size: 0.85em;
		font-weight: 500;
		text-decoration: none;
		transition: opacity 0.2s;

		&:hover {
			opacity: 0.85;
		}
	}
}
</style>
