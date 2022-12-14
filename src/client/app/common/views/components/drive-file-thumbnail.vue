<template>
<div ref="thumbnail" class="zdjebgpv">
	<img-with-blurhash v-if="isThumbnailAvailable" :hash="file.blurhash" :src="file.thumbnailUrl" :alt="file.name" :title="file.name" :style="`object-fit: ${ fit }`"/>
	<fa v-else-if="is === 'image'" :icon="faFileImage" class="icon"/>
	<fa v-else-if="is === 'video'" :icon="faFileVideo" class="icon"/>
	<fa v-else-if="is === 'audio' || is === 'midi'" :icon="faMusic" class="icon"/>
	<fa v-else-if="is === 'csv'" :icon="faFileCsv" class="icon"/>
	<fa v-else-if="is === 'pdf'" :icon="faFilePdf" class="icon"/>
	<fa v-else-if="is === 'textfile'" :icon="faFileAlt" class="icon"/>
	<fa v-else-if="is === 'archive'" :icon="faFileArchive" class="icon"/>
	<fa v-else :icon="faFile" class="icon"/>

	<fa v-if="isThumbnailAvailable && is === 'video'" :icon="faFilm" class="icon-sub"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import anime from 'animejs';
import {
	faFile,
	faFileAlt,
	faFileImage,
	faMusic,
	faFileVideo,
	faFileCsv,
	faFilePdf,
	faFileArchive,
	faFilm,
} from '@fortawesome/free-solid-svg-icons';
import ImgWithBlurhash from './img-with-blurhash.vue';

export default Vue.extend({
	components: {
		ImgWithBlurhash,
	},
	props: {
		file: {
			type: Object,
			required: true,
		},
		fit: {
			type: String,
			required: false,
			default: 'cover',
		},
	},
	data() {
		return {
			isContextmenuShowing: false,
			isDragging: false,

			faFile,
			faFileAlt,
			faFileImage,
			faMusic,
			faFileVideo,
			faFileCsv,
			faFilePdf,
			faFileArchive,
			faFilm,
		};
	},
	computed: {
		is(): 'image' | 'video' | 'midi' | 'audio' | 'csv' | 'pdf' | 'textfile' | 'archive' | 'unknown' {
			if (this.file.type.startsWith('image/')) return 'image';
			if (this.file.type.startsWith('video/')) return 'video';
			if (this.file.type === 'audio/midi') return 'midi';
			if (this.file.type.startsWith('audio/')) return 'audio';
			if (this.file.type.endsWith('/csv')) return 'csv';
			if (this.file.type.endsWith('/pdf')) return 'pdf';
			if (this.file.type.startsWith('text/')) return 'textfile';
			if ([
				'application/zip',
				'application/x-cpio',
				'application/x-bzip',
				'application/x-bzip2',
				'application/java-archive',
				'application/x-rar-compressed',
				'application/x-tar',
				'application/gzip',
				'application/x-7z-compressed',
			].some(e => e === this.file.type)) return 'archive';
			return 'unknown';
		},
		isThumbnailAvailable(): boolean {
			return this.file.thumbnailUrl
				? (this.is === 'image' || this.is === 'video')
				: false;
		},
	},
	mounted() {
		const audioTag = this.$refs.volumectrl as HTMLAudioElement;
		if (audioTag) audioTag.volume = this.$store.state.device.mediaVolume;
	},
	methods: {
		volumechange() {
			const audioTag = this.$refs.volumectrl as HTMLAudioElement;
			this.$store.commit('device/set', { key: 'mediaVolume', value: audioTag.volume });
		},
	},
});
</script>

<style lang="stylus" scoped>
.zdjebgpv
	display flex
	position relative

	> .icon-sub
		position absolute
		width 30%
		height auto
		margin 0
		right 4%
		bottom 4%

	> *
		margin auto

	> .icon
		pointer-events none
		height 65%
		width 65%
</style>
