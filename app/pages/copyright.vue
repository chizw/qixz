<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	title: '版权信息：青序栈网站版权声明和使用条款',
	description: '青序栈网站版权声明和使用条款',
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log', 'blog-tech'])
</script>

<template>
<BlogHeader class="mobile-only" to="/" tag="h1" />

<div class="copyright-page">
	<h1 class="page-title">
		版权信息
	</h1>

	<div class="content-section">
		<h2>© {{ new Date().getFullYear() }} {{ appConfig.title }}</h2>
		<p>本网站的所有文章、图片、音频和视频等内容，未经授权，禁止转载、复制或用于商业用途。</p>

		<div class="info-group">
			<h3>1. 版权声明</h3>
			<p>本网站的所有原创内容（包括但不限于文章、图片、音频、视频等）均受《中华人民共和国著作权法》及相关法律法规的保护。</p>
			<p>本网站采用 <a :href="appConfig.copyright.url" target="_blank">{{ appConfig.copyright.name }}</a> 许可协议，非商业用途的转载或引用请注明出处并保留原文链接。</p>
		</div>

		<div class="info-group">
			<h3>2. 内容使用条款</h3>
			<p>任何单位或个人在未获得本网站明确授权的情况下，不得将本网站的内容用于商业目的，包括但不限于转载、复制、修改、发布、销售等。</p>
			<p>对于违反上述规定的行为，本网站将保留追究法律责任的权利。</p>
		</div>

		<div class="info-group">
			<h3>3. 免责声明</h3>
			<p>本网站提供的内容仅供参考，不构成任何形式的承诺或保证。</p>
			<p>本网站不保证内容的准确性、完整性或及时性，对于因使用本网站内容而产生的任何直接或间接损失，本网站不承担责任。</p>
		</div>

		<div class="info-group">
			<h3>4. 联系方式</h3>
			<p>如需获取授权或有任何疑问，请通过以下方式联系我们：</p>
			<p>邮箱：<a :href="`mailto:${appConfig.author.email}`">{{ appConfig.author.email }}</a></p>
			<p>QQ群：<a href="https://qm.qq.com/q/veCtZrS51e" target="_blank">665751334</a></p>
			<p>GitHub：<a href="https://github.com/chizw" target="_blank">chizw</a></p>
		</div>

		<div class="info-group">
			<h3>5. 网站信息</h3>
			<p>网站名称：{{ appConfig.title }}</p>
			<p>网站副标题：{{ appConfig.subtitle }}</p>
			<p>网站域名：{{ appConfig.url }}</p>
			<p>建立时间：{{ appConfig.timeEstablished }}</p>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.copyright-page {
	max-width: 800px;
	margin: 0 auto;
	padding: 2rem;
	line-height: 1.8;
}

.page-title {
	margin-bottom: 2rem;
	font-size: 2rem;
	font-weight: 700;
	text-align: center;
	color: var(--c-text);
}

.content-section {
	padding: 2rem;
	border-radius: var(--radius);
	box-shadow: var(--ld-shadow);
	background-color: var(--c-card);
}

.info-group {
	margin-bottom: 2rem;
	padding-bottom: 1.5rem;
	border-bottom: 1px solid var(--c-border);

	&:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}
}

h2 {
	margin-bottom: 1rem;
	font-size: 1.5rem;
	color: var(--c-primary);
}

h3 {
	margin-bottom: 0.8rem;
	font-size: 1.2rem;
	color: var(--c-text);
}

p {
	margin-bottom: 0.8rem;
	color: var(--c-text-secondary);
}
</style>
