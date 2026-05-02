<script setup lang="ts">
withDefaults(defineProps<{
	tag?: string
}>(), {
	tag: 'div',
})
const appConfig = useAppConfig()

const titleColor = computed(() => appConfig.header.titleColor || 'var(--c-text)')
</script>

<template>
<UtilLink class="blog-header">
	<div v-if="appConfig.header.gifTail" class="gif-tail">
		<NuxtImg
			:src="appConfig.header.gifTail"
			class="gif-image"
			:alt="appConfig.title"
		/>
	</div>

	<NuxtImg
		:src="appConfig.header.logo"
		class="blog-logo round-cobblestone"
		:class="{ circle: appConfig.header.showTitle }"
		:alt="appConfig.title"
	/>

	<div v-if="appConfig.header.showTitle" class="blog-text">
		<component :is="tag" class="header-title" :style="{ color: titleColor }">
			<span
				v-for="(char, charIndex) in appConfig.title"
				:key="charIndex"
				class="split-char"
				:style="getFixedDelay((charIndex + 1) * .1)"
				v-text="char"
			/>
		</component>

		<div class="header-subtitle">
			{{ appConfig.header.subtitle }}
		</div>
	</div>
</UtilLink>
</template>

<style lang="scss" scoped>
.blog-header {
	contain: layout;
	display: flex;
	align-items: center;
	gap: 0.5em;
	position: relative;
	margin: clamp(1rem, 2rem, 5vh) 1rem min(1rem, 5vh);
	line-height: 1.4;
	color: var(--c-text);
	user-select: none;
}

.blog-logo {
	height: 3em;

	&.circle {
		width: 3em;
		border-radius: 50%;
		box-shadow: 2px 4px 1rem var(--ld-shadow);
	}
}

.header-title {
	font-family: "LXGW WenKai", "Noto Sans SC", sans-serif;
	font-size: 1.5em;
	font-synthesis: none;
	font-variation-settings: "wght" 600, "BEVL" 100;

	> .split-char {
		animation: 3.14s infinite alternate vf-weight, 2.72s infinite alternate vf-bevel;
		animation-delay: var(--delay);
		animation-play-state: paused;
	}
}

.header-subtitle {
	opacity: 0.5;
	font-size: 0.8em;
}

@keyframes vf-weight {
	0% { font-weight: 600; }
	38.2% { font-weight: 300; }
	100% { font-weight: 900; }
}

@keyframes vf-bevel {
	from { font-variation-settings: "BEVL" 100; }
	to { font-variation-settings: "BEVL" 1; }
}

.gif-tail {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	opacity: 0.3;
	inset: -3%;
	transition: opacity 0.7s;
	filter: blur(0.4px);
	pointer-events: none;
	z-index: -1;

	.gif-image {
		width: 120%;
		height: 120%;
		object-fit: contain;
	}
}

.blog-header:hover {
	.gif-tail {
		opacity: 0.5;
	}

	.split-char {
		animation-play-state: running;
	}
}
</style>
