<script setup lang="ts">
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'
import ImageComponent from '#build/mdc-image-component.mjs'

const props = withDefaults(defineProps<{
	src: string
	width?: string | number
	height?: string | number
	alt?: string
	loading?: 'lazy' | 'eager'
	fetchpriority?: 'high' | 'low' | 'auto'
	sizes?: string
	mirror?: ImgService
}>(), {
	alt: '',
})

const FALLBACK_IMG = 'https://s3.qixz.cn/ywty/2026/06/20/6a366d2bcda01.webp'

const refinedSrc = ref(props.src)
const referrerPolicy = ref<'no-referrer' | undefined>(undefined)

onMounted(() => {
	let src = props.src
	if (src.startsWith('/') && !src.startsWith('//')) {
		const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
		if (_base !== '/' && !src.startsWith(_base))
			src = joinURL(_base, src)
	}
	if (props.mirror)
		src = getImgUrl(src, props.mirror)
	refinedSrc.value = src
	referrerPolicy.value = props.mirror ? 'no-referrer' : undefined
})

function onError() {
	if (refinedSrc.value !== FALLBACK_IMG)
		refinedSrc.value = FALLBACK_IMG
}
</script>

<template>
<!-- 优先使用图片原始尺寸，HTML 属性 width/height 缺失时为 0，会导致 srcset 'w' 描述符无效 -->
<!-- 我们在这里通过组件提供 width/height，避免浏览器产生警告 -->
<NuxtImg
	v-if="!refinedSrc"
	:src="FALLBACK_IMG"
	:alt="alt"
	:width="width || 1200"
	:height="height || 800"
	:loading="loading"
	:fetchpriority="fetchpriority"
	:referrerpolicy="referrerPolicy"
/>
<component
	v-else
	:is="ImageComponent"
	:src="refinedSrc"
	:alt="alt"
	:width="width || 1200"
	:height="height || 800"
	:loading="loading"
	:fetchpriority="fetchpriority"
	:sizes="sizes"
	:referrerpolicy="referrerPolicy"
	@error="onError"
/>
</template>
