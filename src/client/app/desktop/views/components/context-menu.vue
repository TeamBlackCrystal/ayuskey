<template>
<div class="context-menu" @contextmenu.prevent="() => {}">
	<x-menu :menu="menu" @x="click"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import anime from 'animejs';
import contains from '../../../common/scripts/contains';
import XMenu from './context-menu.menu.vue';

export default Vue.extend({
	components: {
		XMenu,
	},
	props: ['x', 'y', 'menu'],
	mounted() {
		this.$nextTick(() => {
			const width = this.$el.offsetWidth;
			const height = this.$el.offsetHeight;

			let x = this.x;
			let y = this.y;

			if (x + width - window.pageXOffset > window.innerWidth) {
				x = window.innerWidth - width + window.pageXOffset;
			}

			if (y + height - window.pageYOffset > window.innerHeight) {
				y = window.innerHeight - height + window.pageYOffset;
			}

			this.$el.style.left = x + 'px';
			this.$el.style.top = y + 'px';

			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.addEventListener('mousedown', this.onMousedown);
			}

			this.$el.style.display = 'block';

			anime({
				targets: this.$el,
				opacity: [0, 1],
				duration: 100,
				easing: 'linear',
			});
		});
	},
	methods: {
		onMousedown(e) {
			e.preventDefault();
			if (!contains(this.$el, e.target) && (this.$el != e.target)) this.close();
			return false;
		},
		click(item) {
			if (item.action) item.action();
			this.close();
		},
		close() {
			for (const el of Array.from(document.querySelectorAll('body *'))) {
				el.removeEventListener('mousedown', this.onMousedown);
			}

			this.$emit('closed');
			this.destroyDom();
		},
	},
});
</script>

<style lang="stylus" scoped>
.context-menu
	$width = 240px
	$item-height = 38px
	$padding = 10px

	position fixed
	top 0
	left 0
	z-index 4096
	width $width
	font-size 0.8em
	background var(--popupBg)
	border-radius 0 4px 4px 4px
	box-shadow 2px 2px 8px rgba(#000, 0.2)
	opacity 0

</style>
