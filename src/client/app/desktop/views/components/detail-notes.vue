<template>
<div v-if="!fetching" class="ecsvsegy">
	<div v-if="!notes.length" class="no-highlight">{{$t('@.featured-none')}}</div>
	<sequential-entrance animation="entranceFromTop" delay="25">
		<template v-for="note in notes">
			<mk-note-detail :key="note.id" class="post" :note="note"/>
		</template>
	</sequential-entrance>
	<div v-if="more" class="more">
		<ui-button inline @click="fetchMore()">{{ $t('@.load-more') }}</ui-button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import paging from '../../../common/scripts/paging';

export default Vue.extend({
	i18n: i18n(),

	mixins: [
		paging({
			captureWindowScroll: true,
		}),
	],

	props: {
		pagination: {
			required: true,
		},
		extract: {
			required: false,
		},
	},

	computed: {
		notes() {
			return this.extract ? this.extract(this.items) : this.items;
		},
	},
});
</script>

<style lang="stylus" scoped>
.ecsvsegy
	margin 0 auto

	> * > .post
		margin-bottom 16px

	> .more
		margin 32px 16px 16px 16px
		text-align center

	> .no-highlight
		background var(--face)
		color var(--text)
		font-size 14px
		text-align center
		padding 32px
		border-radius 6px
</style>
