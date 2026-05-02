<script setup lang="ts">
const props = withDefaults(defineProps<{
	type?: 'netease' | 'qq' | 'kugou' | 'kuwo' | 'xiami' | 'apple' | 'spotify'
	id: string
	author?: string
	title?: string
	url?: string
	cover?: string
}>(), {
	type: 'netease',
})

const coverError = ref(false)

const musicInfo = computed(() => {
	if (props.title) {
		return {
			title: props.title,
			author: props.author || '未知艺术家',
		}
	}
	switch (props.type) {
		case 'netease':
			return { title: '网易云音乐', author: '点击播放' }
		case 'qq':
			return { title: 'QQ音乐', author: '点击播放' }
		case 'kugou':
			return { title: '酷狗音乐', author: '点击播放' }
		case 'kuwo':
			return { title: '酷我音乐', author: '点击播放' }
		case 'spotify':
			return { title: 'Spotify', author: '点击播放' }
		default:
			return { title: '未知歌曲', author: '未知艺术家' }
	}
})

const coverUrl = computed(() => {
	if (props.cover) return props.cover
	return undefined
})

const showCover = computed(() => {
	return coverUrl.value && !coverError.value
})

function onCoverError() {
	coverError.value = true
}

const externalUrl = computed(() => {
	switch (props.type) {
		case 'netease':
			return `https://music.163.com/#/song?id=${props.id}`
		case 'qq':
			return `https://y.qq.com/n/ryqq/songDetail/${props.id}`
		case 'kugou':
			return `https://www.kugou.com/song/#hash=${props.id}`
		case 'kuwo':
			return `https://www.kuwo.cn/play_detail/${props.id}`
		case 'spotify':
			return `https://open.spotify.com/track/${props.id}`
		case 'apple':
			return `https://music.apple.com/song/${props.id}`
		default:
			return undefined
	}
})
</script>

<template>
<a
	v-if="externalUrl"
	:href="externalUrl"
	target="_blank"
	rel="noopener"
	class="music-player"
>
	<div class="cover">
		<img v-if="showCover" :src="coverUrl!" :alt="musicInfo.title" @error="onCoverError">
		<Icon v-else name="ph:music-notes-bold" class="placeholder" />
	</div>
	<div class="info">
		<div class="title">{{ musicInfo.title }}</div>
		<div class="author">{{ musicInfo.author }}</div>
	</div>
	<div class="play-icon">
		<Icon name="ph:play-circle-fill" />
	</div>
</a>
</template>

<style lang="scss" scoped>
.music-player {
	display: flex;
	gap: 0.8rem;
	align-items: center;
	margin: 1rem 0;
	padding: 0.8rem 1rem;
	border-radius: 0.6rem;
	box-shadow: 0 2px 0.5rem var(--ld-shadow);
	background: var(--c-bg-2);
	text-decoration: none;
	transition: all 0.2s;
	cursor: pointer;

	&:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 0.8rem var(--ld-shadow);
	}
}

.cover {
	flex-shrink: 0;
	overflow: hidden;
	width: 44px;
	height: 44px;
	border-radius: 0.35rem;
	background: var(--c-bg-soft);

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-size: 1.3rem;
		color: var(--c-text-3);
	}
}

.info {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 0.15rem;
	min-width: 0;
}

.title {
	overflow: hidden;
	font-size: 0.85rem;
	font-weight: 600;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--c-text-1);
}

.author {
	overflow: hidden;
	font-size: 0.7rem;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--c-text-3);
}

.play-icon {
	display: flex;
	align-items: center;
	font-size: 1.6rem;
	color: var(--c-primary);
	transition: transform 0.2s;

	.music-player:hover & {
		transform: scale(1.1);
	}
}
</style>
