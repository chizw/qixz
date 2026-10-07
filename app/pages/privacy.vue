<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	title: '隐私协议：青序栈网站隐私政策和用户数据保护声明',
	description: '青序栈网站隐私政策和用户数据保护声明',
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log', 'blog-tech'])
</script>

<template>
<BlogHeader class="mobile-only" to="/" tag="h1" />

<div class="privacy-page">
	<h1 class="page-title">
		隐私协议
	</h1>

	<div class="content-section">
		<h2>欢迎访问 {{ appConfig.title }}</h2>
		<p>本隐私协议描述了我们如何收集、使用、存储和保护您在访问和使用我们网站时提供的信息。请仔细阅读本协议，了解我们的隐私政策。</p>

		<div class="info-group">
			<h3>1. 信息收集</h3>
			<p>我们可能收集以下类型的信息：</p>
			<ul>
				<li><strong>访问信息</strong>：包括您的IP地址、浏览器类型、访问时间、访问页面等。</li>
				<li><strong>使用信息</strong>：包括您在网站上的浏览路径、点击记录、搜索查询等。</li>
				<li><strong>联系信息</strong>：如果您通过评论、联系表单或其他方式与我们联系，我们可能收集您的姓名、邮箱地址等。</li>
				<li><strong>Cookie和类似技术</strong>：我们使用Cookie和类似技术来改善您的浏览体验，分析网站流量等。</li>
			</ul>
		</div>

		<div class="info-group">
			<h3>2. 信息使用</h3>
			<p>我们收集的信息主要用于以下目的：</p>
			<ul>
				<li>提供、维护和改善我们的网站服务。</li>
				<li>分析网站流量和用户行为，优化网站结构和内容。</li>
				<li>响应用户的咨询、请求和反馈。</li>
				<li>发送网站更新、活动通知等信息（仅当您同意时）。</li>
				<li>保护网站安全，防止欺诈和滥用行为。</li>
			</ul>
		</div>

		<div class="info-group">
			<h3>3. 信息存储和保护</h3>
			<p>我们采取合理的安全措施来保护您的信息，包括：</p>
			<ul>
				<li>使用安全的服务器和网络基础设施。</li>
				<li>对敏感信息进行加密处理。</li>
				<li>限制对用户信息的访问权限。</li>
				<li>定期更新安全措施和技术。</li>
			</ul>
			<p>但请注意，互联网传输和电子存储方式并非100%安全，我们无法保证信息的绝对安全。</p>
		</div>

		<div class="info-group">
			<h3>4. 信息共享</h3>
			<p>我们不会向第三方出售或出租您的个人信息。在以下情况下，我们可能会共享您的信息：</p>
			<ul>
				<li>获得您的明确同意。</li>
				<li>遵守法律法规或响应法律程序。</li>
				<li>保护我们的权利、财产或安全，以及用户和公众的安全。</li>
				<li>与我们的服务提供商共享，这些提供商帮助我们运营网站、处理支付等，但他们必须遵守保密义务。</li>
			</ul>
		</div>

		<div class="info-group">
			<h3>5. Cookie政策</h3>
			<p>我们使用Cookie来：</p>
			<ul>
				<li>记住您的偏好设置。</li>
				<li>分析网站流量和使用情况。</li>
				<li>提供个性化的内容和广告。</li>
			</ul>
			<p>您可以通过浏览器设置拒绝或删除Cookie，但这可能会影响网站的某些功能。</p>
		</div>

		<div class="info-group">
			<h3>6. 第三方链接</h3>
			<p>我们的网站可能包含指向第三方网站的链接。这些网站有自己的隐私政策，我们对它们的内容和隐私实践不承担责任。请在访问这些网站前阅读它们的隐私政策。</p>
		</div>

		<div class="info-group">
			<h3>7. 儿童隐私</h3>
			<p>我们的网站不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果您发现我们收集了儿童的信息，请联系我们，我们将立即删除。</p>
		</div>

		<div class="info-group">
			<h3>8. 隐私政策的变更</h3>
			<p>我们可能会不时更新本隐私协议。更新后的协议将在网站上公布，并注明更新日期。您的持续使用表示您同意修订后的协议。</p>
		</div>

		<div class="info-group">
			<h3>9. 联系方式</h3>
			<p>如果您对本隐私协议有任何疑问或建议，请通过以下方式联系我们：</p>
			<p>邮箱：<a :href="`mailto:${appConfig.author.email}`">{{ appConfig.author.email }}</a></p>
			<p>QQ群：<a href="https://qm.qq.com/q/veCtZrS51e" target="_blank">665751334</a></p>
			<p>GitHub：<a href="https://github.com/chizw" target="_blank">chizw</a></p>
		</div>

		<div class="info-group">
			<h3>10. 生效日期</h3>
			<p>本隐私协议自 {{ new Date().getFullYear() }} 年 {{ new Date().getMonth() + 1 }} 月 {{ new Date().getDate() }} 日起生效。</p>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.privacy-page {
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

ul {
	margin-bottom: 0.8rem;
	padding-left: 1.5rem;
	color: var(--c-text-secondary);

	li {
		margin-bottom: 0.5rem;
	}
}
</style>
