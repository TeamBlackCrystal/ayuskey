<template>
<div style="display: inline-flex; align-items: center;">
	<div v-if="visibility == 'public'" class="wrap" :title="$t('@.note-visibility.public')">
		<fa icon="globe"/>
	</div>
	<div v-else-if="visibility == 'home'" class="wrap" :title="$t('@.note-visibility.home')">
		<fa icon="home"/>
	</div>
	<div v-else-if="visibility == 'followers'" class="wrap" :title="$t('@.note-visibility.followers')">
		<fa icon="lock"/>
	</div>
	<div v-else-if="visibility == 'specified'" class="wrap" :title="$t('@.note-visibility.specified')">
		<fa icon="envelope"/>
	</div>
	<div v-else-if="visibility == 'local-public'" class="wrap" :title="$t('@.note-visibility.local-public')">
		<div><fa icon="globe"/></div>
		<div class="localOnly"><fa icon="heart"/></div>
	</div>
	<div v-else-if="visibility == 'local-home'" class="wrap" :title="$t('@.note-visibility.local-home')">
		<div><fa icon="home"/></div>
		<div class="localOnly"><fa icon="heart"/></div>
	</div>
	<div v-else-if="visibility == 'local-followers'" class="wrap" :title="$t('@.note-visibility.local-followers')">
		<div><fa icon="lock"/></div>
		<div class="localOnly"><fa icon="heart"/></div>
	</div>
	<div v-else-if="visibility == 'local-specified'" class="wrap" :title="$t('@.note-visibility.local-specified')">
		<div><fa icon="envelope"/></div>
		<div class="localOnly"><fa icon="heart"/></div>
	</div>
	<div v-if="visibility == 'once-public'" class="wrap" :title="$t('@.note-visibility.once-public')">
		<fa :icon="faHandHoldingHeart"/>
	</div>
	<div v-else-if="visibility == 'once-home'" class="wrap" :title="$t('@.note-visibility.once-home')">
		<fa :icon="faHandHoldingHeart"/>
	</div>
	<div v-else-if="visibility == 'once-specified'" class="wrap" :title="$t('@.note-visibility.once-specified')">
		<fa :icon="faSatelliteDish"/>
	</div>
	<div v-if="withText" style="margin-left: 0.3em">
		<span v-if="visibility == 'public'">{{ $t('@.note-visibility.public') }}</span>
		<span v-else-if="visibility == 'home'">{{ $t('@.note-visibility.home') }}</span>
		<span v-else-if="visibility == 'followers'">{{ $t('@.note-visibility.followers') }}</span>
		<span v-else-if="visibility == 'specified'">{{ $t('@.note-visibility.specified') }}</span>
		<span v-else-if="visibility == 'local-public'">{{ $t('@.note-visibility.local-public') }}</span>
		<span v-else-if="visibility == 'local-home'">{{ $t('@.note-visibility.local-home') }}</span>
		<span v-else-if="visibility == 'local-followers'">{{ $t('@.note-visibility.local-followers') }}</span>
		<span v-else-if="visibility == 'once-public'">{{ $t('@.note-visibility.once-public') }}</span>
		<span v-else-if="visibility == 'once-home'">{{ $t('@.note-visibility.once-home') }}</span>
		<span v-else-if="visibility == 'once-specified'">{{ $t('@.note-visibility.once-specified') }}</span>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import i18n from '../../../i18n';
import { faHandHoldingHeart, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';

export default defineComponent({
	i18n: i18n(),
	props: {
		v: {
			type: String,
			required: true,
		},
		localOnly: {
			type: Boolean,
			required: false,
			default: false,
		},
		copyOnce: {
			type: Boolean,
			required: false,
			default: false,
		},
		withText: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			faHandHoldingHeart, faSatelliteDish,
		};
	},
	computed: {
		visibility(): string {
			return this.localOnly ? `local-${this.v}` : this.copyOnce ? `once-${this.v}` : this.v;
		},
	},
});
</script>

<style lang="stylus" scoped>
	.wrap
		> .localOnly
				color var(--primary)
				position absolute
				top -0.5em
				right -0.5em
				transform scale(0.8)
</style>
