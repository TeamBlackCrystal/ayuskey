<template>
<x-draggable tag="div" :list="blocks" handle=".drag-handle" :group="{ name: 'blocks' }" animation="150" swap-threshold="0.5">
	<component :is="'x-' + block.type" v-for="block in blocks" :key="block.id" :value="block" :ai-script="aiScript" @input="updateItem" @remove="() => removeItem(block)"/>
</x-draggable>
</template>

<script lang="ts">
import Vue from 'vue';
import XDraggable from 'vuedraggable';
import XSection from './els/page-editor.el.section.vue';
import XText from './els/page-editor.el.text.vue';
import XTextarea from './els/page-editor.el.textarea.vue';
import XImage from './els/page-editor.el.image.vue';
import XButton from './els/page-editor.el.button.vue';
import XTextInput from './els/page-editor.el.text-input.vue';
import XTextareaInput from './els/page-editor.el.textarea-input.vue';
import XNumberInput from './els/page-editor.el.number-input.vue';
import XSwitch from './els/page-editor.el.switch.vue';
import XIf from './els/page-editor.el.if.vue';
import XPost from './els/page-editor.el.post.vue';
import XCounter from './els/page-editor.el.counter.vue';
import XRadioButton from './els/page-editor.el.radio-button.vue';

export default Vue.extend({
	components: {
		XDraggable, XSection, XText, XImage, XButton, XTextarea, XTextInput, XTextareaInput, XNumberInput, XSwitch, XIf, XPost, XCounter, XRadioButton,
	},

	props: {
		value: {
			type: Array,
			required: true,
		},
		aiScript: {
			required: true,
		},
	},

	computed: {
		blocks() {
			return this.value;
		},
	},

	methods: {
		updateItem(v) {
			const i = this.blocks.findIndex(x => x.id === v.id);
			const newValue = [
				...this.blocks.slice(0, i),
				v,
				...this.blocks.slice(i + 1),
			];
			this.$emit('input', newValue);
		},

		removeItem(el) {
			const i = this.blocks.findIndex(x => x.id === el.id);
			const newValue = [
				...this.blocks.slice(0, i),
				...this.blocks.slice(i + 1),
			];
			this.$emit('input', newValue);
		},
	},
});
</script>
