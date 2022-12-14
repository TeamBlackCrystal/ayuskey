<template>
<div class="gqyayizv">
	<div ref="backdrop" class="backdrop" :class="{'blur': $store.state.device.useBlur}" @click="close"></div>
	<div ref="popover" class="popover" :class="{ isMobile: $root.isMobile }">
		<div :class="{ active: v == 'public' }" @click="choose('public')">
			<x-visibility-icon v="public"/>
			<div>
				<span>{{ $t('public') }}</span>
				<span>{{ $t('public-desc') }}</span>
			</div>
		</div>
		<div :class="{ active: v == 'home' }" @click="choose('home')">
			<x-visibility-icon v="home"/>
			<div>
				<span>{{ $t('home') }}</span>
				<span>{{ $t('home-desc') }}</span>
			</div>
		</div>
		<div :class="{ active: v == 'followers' }" @click="choose('followers')">
			<x-visibility-icon v="followers"/>
			<div>
				<span>{{ $t('followers') }}</span>
				<span>{{ $t('followers-desc') }}</span>
			</div>
		</div>
		<div :class="{ active: v == 'specified' }" @click="choose('specified')">
			<x-visibility-icon v="specified"/>
			<div>
				<span>{{ $t('specified') }}</span>
				<span>{{ $t('specified-desc') }}</span>
			</div>
		</div>
		<!--
		<div @click="choose('once-public')" :class="{ active: v == 'once-public' }">
			<x-visibility-icon v="once-public"/>
			<div>
				<span>{{ $t('once-public') }}</span>
				<span>{{ $t('once-public-desc') }}</span>
			</div>
		</div>
		-->
		<div :class="{ active: v == 'local-public' }" @click="choose('local-public')">
			<x-visibility-icon v="local-public"/>
			<div>
				<span>{{ $t('local-public') }}</span>
				<span>{{ $t('local-public-desc') }}</span>
			</div>
		</div>
		<div :class="{ active: v == 'local-home' }" @click="choose('local-home')">
			<x-visibility-icon v="local-home"/>
			<div>
				<span>{{ $t('local-home') }}</span>
			</div>
		</div>
		<div :class="{ active: v == 'local-followers' }" @click="choose('local-followers')">
			<x-visibility-icon v="local-followers"/>
			<div>
				<span>{{ $t('local-followers') }}</span>
			</div>
		</div>
		<!--
		<div @click="choose('once-specified')" :class="{ active: v == 'once-specified' }">
			<x-visibility-icon v="once-specified"/>
			<div>
				<span>{{ $t('once-specified') }}</span>
			</div>
		</div>
		-->
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import anime from 'animejs';
import XVisibilityIcon from './visibility-icon.vue';

export default Vue.extend({
	i18n: i18n('common/views/components/visibility-chooser.vue'),
	components: {
		XVisibilityIcon,
	},
	props: {
		source: {
			required: true,
		},
		currentVisibility: {
			type: String,
			required: false,
		},
	},
	data() {
		return {
			v: this.$store.state.settings.rememberNoteVisibility ? (this.$store.state.device.visibility || this.$store.state.settings.defaultNoteVisibility) : (this.currentVisibility || this.$store.state.settings.defaultNoteVisibility),
		};
	},
	mounted() {
		this.$nextTick(() => {
			const popover = this.$refs.popover as any;

			const rect = this.source.getBoundingClientRect();
			const width = popover.offsetWidth;
			const height = popover.offsetHeight;

			let left;
			let top;

			if (this.$root.isMobile) {
				const x = rect.left + window.pageXOffset + (this.source.offsetWidth / 2);
				const y = rect.top + window.pageYOffset + (this.source.offsetHeight / 2);
				left = (x - (width / 2));
				top = (y - (height / 2));
			} else {
				const x = rect.left + window.pageXOffset + (this.source.offsetWidth / 2);
				const y = rect.top + window.pageYOffset + this.source.offsetHeight;
				left = (x - (width / 2));
				top = y;
			}

			if (left + width > window.innerWidth) {
				left = window.innerWidth - width;
			}

			popover.style.left = left + 'px';
			popover.style.top = top + 'px';

			anime({
				targets: this.$refs.backdrop,
				opacity: 1,
				duration: 100,
				easing: 'linear',
			});

			anime({
				targets: this.$refs.popover,
				opacity: 1,
				scale: [0.5, 1],
				duration: 500,
			});
		});
	},
	methods: {
		choose(visibility) {
			if (this.$store.state.settings.rememberNoteVisibility) {
				this.$store.commit('device/setVisibility', visibility);
			}
			this.$emit('chosen', visibility);
			this.destroyDom();
		},
		close() {
			(this.$refs.backdrop as any).style.pointerEvents = 'none';
			anime({
				targets: this.$refs.backdrop,
				opacity: 0,
				duration: 200,
				easing: 'linear',
			});

			(this.$refs.popover as any).style.pointerEvents = 'none';
			anime({
				targets: this.$refs.popover,
				opacity: 0,
				scale: 0.5,
				duration: 200,
				easing: 'easeInBack',
				complete: () => this.destroyDom(),
			});
		},
	},
});
</script>

<style lang="stylus" scoped>
.gqyayizv
	position initial

	> .backdrop
		position fixed
		top 0
		left 0
		z-index 10000
		width 100%
		height 100%
		background var(--modalBackdrop)
		opacity 0
	
	> .blur
		backdrop-filter blur(4px)

	> .popover
		$bgcolor = var(--popupBg)
		position absolute
		z-index 10001
		width 240px
		padding 8px 0
		background $bgcolor
		border-radius 4px
		box-shadow 0 3px 12px rgba(27, 31, 35, 0.15)
		transform scale(0.5)
		opacity 0

		&:not(.isMobile)
			$arrow-size = 10px

			margin-top $arrow-size
			transform-origin center -($arrow-size)

			&:before
				content ""
				display block
				position absolute
				top -($arrow-size * 2)
				left s('calc(50% - %s)', $arrow-size)
				border-top solid $arrow-size transparent
				border-left solid $arrow-size transparent
				border-right solid $arrow-size transparent
				border-bottom solid $arrow-size $bgcolor

		> div
			display flex
			padding 8px 14px
			font-size 12px
			color var(--popupFg)
			cursor pointer

			&:hover
				background var(--faceClearButtonHover)

			&:active
				background var(--faceClearButtonActive)

			&.active
				color var(--primaryForeground)
				background var(--primary)

			> *
				user-select none
				pointer-events none

			> *:first-child
				display flex
				justify-content center
				align-items center
				margin-right 10px
				width 16px

			> *:last-child
				flex 1 1 auto

				> span:first-child
					display block
					font-weight bold

				> span:last-child:not(:first-child)
					opacity 0.6

</style>
