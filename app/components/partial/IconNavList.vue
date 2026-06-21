<script setup lang="ts">
import type { NavItem } from '~/types/nav'

defineProps<{
	list: NavItem[]
}>()
</script>

<template>
<div class="icon-nav-list">
	<UtilLink
		v-for="{ text, icon, url } in list"
		:key="text"
		v-tip="text"
		:to="url"
		:aria-label="text"
	>
		<Icon :name="icon" />
	</UtilLink>
</div>
</template>

<style lang="scss" scoped>
.icon-nav-list {
	display: flex;
	justify-content: center;

	a {
		padding: 0.5em;
		border-radius: 2em;
		transition: background-color 0.2s;

		&:hover {
			background-color: var(--c-bg-soft);
		}

		.iconify {
			display: block;
		}
	}
}
</style>
