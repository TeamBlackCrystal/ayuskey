<template>
<div v-if="video.isSensitive && hide && !$store.state.device.alwaysShowNsfw" class="uofhebxjdgksfmltszlxurtjnjjsvioh" @click="hide = false">
	<div>
		<b><fa icon="exclamation-triangle"/> {{ $t('sensitive') }}</b>
		<span>{{ $t('click-to-show') }}</span>
	</div>
</div>
<div v-else class="vwxdhznewyashiknzolsoihtlpicqepe">
	<a
		class="thumbnail"
		:href="video.url"
		:style="imageStyle"
		:title="video.name"
		@click.prevent="onClick"
	>
		<fa :icon="['far', 'play-circle']"/>
	</a>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import MkMediaVideoDialog from './media-video-dialog.vue';

export default Vue.extend({
	i18n: i18n('desktop/views/components/media-video.vue'),
	props: {
		video: {
			type: Object,
			required: true,
		},
		inlinePlayable: {
			default: false,
		},
	},
	data() {
		return {
			hide: true,
		};
	},
	computed: {
		imageStyle(): any {
			return {
				'background-image': `url(${this.video.thumbnailUrl})`,
			};
		},
	},
	methods: {
		onClick() {
			const videoTag = this.$refs.video as (HTMLVideoElement | null);
			let start = 0;
			if (videoTag) {
				start = videoTag.currentTime;
				videoTag.pause();
			}
			this.$root.new(MkMediaVideoDialog, {
				video: this.video,
				start,
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.vwxdhznewyashiknzolsoihtlpicqepe
	.video
		display block
		width 100%
		height 100%
		border-radius 4px

	.thumbnail
		display flex
		justify-content center
		align-items center
		font-size 3.5em
		cursor zoom-in
		overflow hidden
		background-position center
		background-size cover
		width 100%
		height 100%

.uofhebxjdgksfmltszlxurtjnjjsvioh
	display flex
	justify-content center
	align-items center
	background #111
	color #fff

	> div
		display table-cell
		text-align center
		font-size 12px

		> b
			display block
</style>
