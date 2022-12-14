<template>
<x-column :name="name" :column="column" :is-stacked="isStacked" :pos="pos">
	<template #header><fa icon="at"/>{{ name }}</template>

	<x-notes ref="timeline" :pagination="pagination" @inited="() => $emit('loaded')"/>
</x-column>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import XColumn from './deck.column.vue';
import XNotes from './deck.notes.vue';

export default Vue.extend({
	i18n: i18n(),

	components: {
		XColumn,
		XNotes,
	},

	props: {
		column: {
			type: Object,
			required: true,
		},
		isStacked: {
			type: Boolean,
			required: true,
		},
		pos: {
			type: Object,
			required: false,
			default: () => {},
		},
	},

	data() {
		return {
			connection: null,
			pagination: {
				endpoint: 'notes/mentions',
				limit: 10,
				params: init => ({
					untilDate: init ? undefined : (this.date ? this.date.getTime() : undefined),
					includeMyRenotes: this.$store.state.settings.showMyRenotes,
					includeRenotedMyNotes: this.$store.state.settings.showRenotedMyNotes,
					includeLocalRenotes: this.$store.state.settings.showLocalRenotes,
				}),
			},
		};
	},

	computed: {
		name(): string {
			if (this.column.name) return this.column.name;
			return this.$t('@deck.mentions');
		},
	},

	mounted() {
		this.connection = this.$root.stream.useSharedConnection('main');
		this.connection.on('mention', this.onNote);
	},

	beforeDestroy() {
		this.connection.dispose();
	},

	methods: {
		onNote(note) {
			(this.$refs.timeline as any).prepend(note);
		},

		focus() {
			this.$refs.timeline.focus();
		},
	},
});
</script>
