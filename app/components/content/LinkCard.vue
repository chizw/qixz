<script setup lang="ts">
defineProps<{
	link: string
	title: string
	description?: string
	icon?: string
	favicon?: string
	mirror?: ImgService
}>()
</script>

<template>
<UtilLink :to="link" class="link-card card" :title="joinWith([title, description, link])">
	<div class="link-card-info">
		<div class="link-card-title">
			{{ title }}
		</div>
		<div class="link-card-description">
			{{ description ?? getDomain(link) }}
		</div>
	</div>
	<slot name="icon" class="link-card-icon-slot">
		<UtilImg v-if="icon" class="link-card-icon" :src="icon" :mirror />
		<img v-else-if="favicon" class="link-card-favicon" :src="favicon" alt="" @error="($event.target as HTMLImageElement).style.display = 'none'">
		<Icon v-else name="ph:link-bold" class="link-card-default-icon" />
	</slot>
</UtilLink>
</template>

<style lang="scss" scoped>
.link-card {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 20rem;
	max-width: 90%;
	margin: 2rem auto;
	padding: 0.5em 0.8em;
	font-size: 0.9em;
	line-height: 1.4;

	.link-card-info {
		flex-grow: 1;
		overflow: hidden;
	}

	.link-card-title {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.link-card-description {
		overflow: hidden;
		opacity: 0.5;
		margin-top: 0.2em;
		font-size: 0.9em;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.link-card-icon {
		flex-shrink: 0;
		height: 3rem;
		max-width: 5rem;
		border-radius: 0.5rem;
		object-fit: cover;
	}

	.link-card-favicon {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 0.3rem;
		object-fit: contain;
	}

	.link-card-default-icon {
		flex-shrink: 0;
		font-size: 1.5rem;
		color: var(--c-text-3);
	}
}
</style>
