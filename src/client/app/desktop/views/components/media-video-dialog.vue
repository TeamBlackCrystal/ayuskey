<template>
<ui-modal v-hotkey.global="keymap">
	<video ref="video" :src="video.url" :title="video.name" controls autoplay @volumechange="volumechange" />
</ui-modal>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: ['video', 'start'],
	computed: {
		keymap(): any {
			return {
				'esc': this.close,
			};
		},
	},
	mounted() {
		const videoTag = this.$refs.video as HTMLVideoElement;
		if (this.start) videoTag.currentTime = this.start;
		videoTag.volume = this.$store.state.device.mediaVolume;
	},
	methods: {
		close() {
		},
		volumechange() {
			const videoTag = this.$refs.video as HTMLVideoElement;
			this.$store.commit('device/set', { key: 'mediaVolume', value: videoTag.volume });
		},
	},
});
</script>

<style lang="stylus" scoped>
video
	position fixed
	z-index 2
	top 0
	right 0
	bottom 0
	left 0
	max-width 80vw
	max-height 80vh
	margin auto

</style>
