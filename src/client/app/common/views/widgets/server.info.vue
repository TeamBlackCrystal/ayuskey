<template>
<div class="info">
	<p>
		Maintainer:
		<b
		><a :href="'mailto:' + meta.maintainerEmail" target="_blank">{{
			meta.maintainerName
		}}</a></b
		>
	</p>
	<p>Machine: {{ meta.machine }}</p>
	<p>Node: {{ meta.node }}</p>
	<p>PSQL: {{ meta.psql }}</p>
	<p>Redis: {{ meta.redis }}</p>
	<p>Version: {{ meta.version }}</p>
</div>
</template>

<script setup lang="ts">
const { meta } = defineProps({ meta: { type: Object } });
</script>

<style lang="stylus" scoped>
.info
	padding 10px 14px

	> p
		margin 0
		font-size 12px
		color var(--text)
</style>
