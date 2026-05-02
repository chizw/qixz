<script setup lang="ts">
const props = defineProps<{
	owner: string
	repo: string
	url: string
	description?: string
	stars?: number
	forks?: number
}>()

function formatNumber(num: number | undefined): string {
	if (!num) return '0'
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
	}
	return num.toString()
}
</script>

<template>
<a :href="url" target="_blank" rel="noopener" class="github-card">
	<div class="header">
		<Icon name="mdi:github" class="github-icon" />
		<span class="repo-name">{{ owner }}/{{ repo }}</span>
	</div>
	<p v-if="description" class="description">{{ description }}</p>
	<div class="stats">
		<span class="stat">
			<Icon name="ph:star-bold" />
			{{ formatNumber(stars) }}
		</span>
		<span class="stat">
			<Icon name="ph:git-fork-bold" />
			{{ formatNumber(forks) }}
		</span>
	</div>
</a>
</template>

<style lang="scss" scoped>
.github-card {
	display: block;
	padding: 1rem;
	border-radius: 0.6rem;
	background: var(--c-bg-2);
	box-shadow: 0 2px 0.5rem var(--ld-shadow);
	text-decoration: none;
	transition: all 0.2s;

	&:hover {
		box-shadow: 0 4px 1rem var(--ld-shadow);
		transform: translateY(-2px);
	}
}

.header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.github-icon {
	flex-shrink: 0;
	font-size: 1.2rem;
	color: var(--c-text-2);
}

.repo-name {
	overflow: hidden;
	font-weight: 600;
	font-size: 0.9rem;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--c-text-1);
}

.description {
	margin: 0.5rem 0 0;
	font-size: 0.85rem;
	line-height: 1.5;
	color: var(--c-text-2);
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.stats {
	display: flex;
	gap: 1rem;
	margin-top: 0.75rem;
}

.stat {
	display: flex;
	align-items: center;
	gap: 0.3rem;
	font-size: 0.8rem;
	color: var(--c-text-3);

	.iconify {
		font-size: 0.9rem;
	}
}
</style>
