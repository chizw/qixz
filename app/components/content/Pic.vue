<script setup lang="ts">
import { LazyPopoverLightbox } from '#components'

const props = withDefaults(defineProps<{
	src: string
	mirror?: ImgService
	caption?: string
	width?: string | number
	height?: string | number
	zoom?: boolean
}>(), {
	caption: '',
	zoom: true,
})

const pic = ref()
const picEl = useCurrentElement<HTMLImageElement>(pic)
const hasError = ref(false)

const popoverStore = usePopoverStore()

const { open } = popoverStore.use(
	() => {
		if (!picEl.value)
			return h('div')
		return h(LazyPopoverLightbox, {
			el: picEl.value,
			caption: props.caption,
		})
	},
	{ unique: true },
)

function onImageError() {
	hasError.value = true
}
</script>

<template>
<figure class="image">
	<div v-if="hasError" class="image-error" :style="zoom ? { cursor: 'zoom-in' } : undefined">
		<Icon name="ph:image-broken-bold" class="error-icon" />
		<span class="error-text">图片加载失败</span>
	</div>
	<UtilImg
		v-else
		ref="pic"
		class="image"
		:style="zoom ? { cursor: 'zoom-in' } : undefined"
		:src :alt="caption" :width :height :mirror
		:loading="width || height ? 'eager' : 'lazy'"
		@click="zoom && open()"
		@error="onImageError"
	/>
	<figcaption v-if="caption" aria-hidden v-text="caption" />
</figure>
</template>

<style lang="scss" scoped>
figcaption {
	margin-top: -0.5em;
	font-size: 0.8em;
	text-align: center;
	color: var(--c-text-2);
}

.image-error {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	width: 100%;
	height: 100%;
	min-height: 120px;
	border-radius: 8px;
	background: var(--c-bg-soft);
	color: var(--c-text-3);

	.error-icon {
		font-size: 2rem;
	}

	.error-text {
		font-size: 0.8rem;
	}
}
</style>
