<template>
<mk-ui>
	<template #header><span style="margin-right:4px;"><fa icon="gamepad"/></span>{{ $t('reversi') }}</template>
	<x-reversi :game-id="$route.params.game" :self-nav="false" @nav="nav"/>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../../i18n';

export default Vue.extend({
	i18n: i18n('mobile/views/pages/games/reversi.vue'),
	components: {
		XReversi: () => import('../../../../common/views/components/games/reversi/reversi.vue').then(m => m.default),
	},
	mounted() {
		document.title = `${this.$root.instanceName} | ${this.$t('reversi')}`;
	},
	methods: {
		nav(game, actualNav) {
			if (actualNav) {
				this.$router.push(`/games/reversi/${game.id}`);
			} else {
				// TODO: https://github.com/vuejs/vue-router/issues/703
				this.$router.push(`/games/reversi/${game.id}`);
			}
		},
	},
});
</script>
