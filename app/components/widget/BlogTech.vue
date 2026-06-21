<script setup lang="ts">
import { packageManager, version } from '~~/package.json'
import pnpmWorkspace from '~~/pnpm-workspace.yaml'

const appConfig = useAppConfig()
const { public: { arch, nodeVersion, platform } } = useRuntimeConfig()

const packages = Object.assign({}, ...Object.values(pnpmWorkspace.catalogs as any)) as Record<string, string>
const [pm, pmVersion] = packageManager.split('@') as [string, string]

const service = computed(() => ([
	{ label: '全球加速', value: () => [h('img', { src: 'https://s3.qixz.cn/ywty/icons/alibabacloud-color.svg', alt: 'ESA', width: 16, height: 16 }), 'ESA'] },
	{ label: '构建平台', value: () => [h('img', { src: 'https://s3.qixz.cn/ywty/icons/cloudflare.ico', alt: 'Cloudflare', width: 16, height: 16 }), 'Cloudflare'] },
	{ label: '图片存储', value: () => [h('img', { src: 'https://s3.qixz.cn/ywty/icons/ywty.ico', alt: '云雾图驿', width: 16, height: 16 }), '云雾图驿'] },
	{ label: '文章许可', value: appConfig.copyright.abbr },
	{ label: '规范域名', value: getDomain(appConfig.url) },
]))

const techstack = computed(() => ([
	{ label: 'Blog', value: version },
	{ label: 'Vue', value: packages.vue },
	{ label: 'Nuxt', value: packages.nuxt },
	{ label: 'Content', value: packages['@nuxt/content'] },
	{ label: 'Node', value: nodeVersion },
	{ label: pm, value: pmVersion },
	{ label: 'OS', value: platform },
	{ label: 'Arch', value: arch },
]))

const expand = ref(false)
</script>

<template>
<BlogWidget card title="技术信息">
	<ZDlGroup :items="service" />
	<ZExpand v-model="expand" in-place name="构建信息">
		<ZDlGroup size="small" :items="techstack" />
	</ZExpand>
</BlogWidget>
</template>

<style lang="scss" scoped>
.z-expand {
	margin-top: 0.2em;
}

.dl-group :deep(img) {
	width: auto;
	height: 1.2em;
	margin-right: 0.35em;
	vertical-align: sub;
	object-fit: contain;
}
</style>
