<script setup lang="ts">
const props = defineProps<{
	name: string
	address?: string
	latitude?: number
	longitude?: number
	url?: string
}>()

const mapUrl = computed(() => {
	if (props.url)
		return props.url
	if (props.latitude && props.longitude) {
		return `https://www.openstreetmap.org/?mlat=${props.latitude}&mlon=${props.longitude}#map=15/${props.latitude}/${props.longitude}`
	}
	if (props.name) {
		return `https://www.openstreetmap.org/search?query=${encodeURIComponent(props.name)}`
	}
	return undefined
})
</script>

<template>
<div class="location-card">
	<div class="icon">
		<Icon name="ph:map-pin-bold" />
	</div>
	<div class="info">
		<div class="name">
			{{ name }}
		</div>
		<div v-if="address" class="address">
			{{ address }}
		</div>
	</div>
	<a v-if="mapUrl" :href="mapUrl" target="_blank" rel="noopener" class="map-link">
		<Icon name="ph:arrow-square-out-bold" />
	</a>
</div>
</template>

<style lang="scss" scoped>
.location-card {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	border-radius: 0.6rem;
	background: var(--c-bg-2);
	box-shadow: 0 2px 0.5rem var(--ld-shadow);
}

.icon {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	background: var(--c-primary-light);
	font-size: 1.2rem;
	color: var(--c-primary);
}

.info {
	flex: 1;
	min-width: 0;
}

.name {
	overflow: hidden;
	font-weight: 600;
	font-size: 0.9rem;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--c-text-1);
}

.address {
	overflow: hidden;
	margin-top: 0.2rem;
	font-size: 0.8rem;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--c-text-3);
}

.map-link {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.4rem;
	border-radius: 0.4rem;
	font-size: 1rem;
	color: var(--c-text-3);
	transition: all 0.2s;

	&:hover {
		background: var(--c-bg-soft);
		color: var(--c-primary);
	}
}
</style>
