<template>
<div
	v-show="($store.state.settings.remainDeletedNote || appearNote.deletedAt == null) && !hideThisNote"
	v-hotkey="keymap"
	class="note"
	:class="{ mini: narrow, 'note-reply-frame': appearNote.reply }"
	:tabindex="appearNote.deletedAt == null ? '-1' : null"
	:title="title"
>
	<x-sub v-for="note in conversation" :key="note.id" :note="note"/>
	<mk-renote v-if="isRenote" class="renote" :note="note" :class="{'reply-border': appearNote.reply}"/>
	<div v-if="appearNote.reply && (!$store.getters.isSignedIn || $store.state.settings.showReplyTarget)" class="reply-to">
		<x-sub :note="appearNote.reply"/>
	</div>
	<article class="article" :class="{'reply-border': appearNote.reply}">
		<mk-avatar class="avatar" :user="appearNote.user"/>
		<div class="main">
			<mk-note-header class="header" :note="appearNote" :mini="narrow"/>
			<x-instance-ticker v-if="appearNote.user.instance && $store.state.device.instanceTicker != 'none'" :instance="appearNote.user.instance" />
			<div v-if="appearNote.deletedAt == null" class="body">
				<p v-if="appearNote.cw != null" class="cw">
					<mfm v-if="appearNote.cw != ''" class="text" :text="appearNote.cw" :author="appearNote.user" :i="$store.state.i" :custom-emojis="appearNote.emojis" />
					<mk-cw-button v-model="showContent" :note="appearNote"/>
				</p>
				<div v-show="appearNote.cw == null || showContent" class="content">
					<div class="text">
						<span v-if="appearNote.isHidden" style="opacity: 0.5">{{ $t('private') }}</span>
						<a v-if="appearNote.reply" class="reply"><fa icon="reply"/></a>
						<mfm v-if="appearNote.text" :text="appearNote.text" :author="appearNote.user" :i="$store.state.i" :custom-emojis="appearNote.emojis"/>
					</div>
					<div v-if="appearNote.files.length > 0" class="files">
						<mk-media-list :media-list="appearNote.files"/>
					</div>
					<mk-poll v-if="appearNote.poll" ref="pollViewer" :note="appearNote"/>
					<a v-if="appearNote.geo" class="location" :href="`https://maps.google.com/maps?q=${appearNote.geo.coordinates[1]},${appearNote.geo.coordinates[0]}`" rel="noopener" target="_blank"><fa icon="map-marker-alt"/> ????????????</a>
					<div v-if="appearNote.renote" class="renote"><mk-note-preview :note="appearNote.renote"/></div>
					<mk-url-preview v-for="url in urls" :key="url" :url="url" :compact="compact"/>
				</div>
			</div>
			<footer v-if="appearNote.deletedAt == null && !preview" class="footer">
				<span v-if="appearNote.app && narrow && $store.state.settings.showVia" class="app">via <b>{{ appearNote.app.name }}</b></span>
				<mk-reactions-viewer ref="reactionsViewer" :note="appearNote"/>
				<button class="replyButton button" :title="$t('reply')" @click="reply()">
					<template v-if="appearNote.reply"><fa icon="reply-all"/></template>
					<template v-else><fa icon="reply"/></template>
					<p v-if="appearNote.repliesCount > 0" class="count">{{ appearNote.repliesCount }}</p>
				</button>
				<button v-if="['public', 'home'].includes(appearNote.visibility)" class="renoteButton button" :title="$t('renote')" @click="renote()">
					<fa icon="retweet"/>
					<p v-if="appearNote.renoteCount > 0" class="count">{{ appearNote.renoteCount }}</p>
				</button>
				<button v-else class="inhibitedButton button">
					<fa icon="ban"/>
				</button>
				<button v-if="appearNote.myReaction == null" ref="reactButton" class="reactionButton button" :title="$t('add-reaction')" @click="react()">
					<fa icon="plus"/>
					<p v-if="Object.values(appearNote.reactions).some(x => x)" class="count">{{ Object.values(appearNote.reactions).reduce((a, c) => a + c, 0) }}</p>
				</button>
				<button v-if="appearNote.myReaction != null" ref="reactButton" class="reactionButton reacted button" :title="$t('undo-reaction')" @click="undoReact(appearNote)">
					<fa icon="minus"/>
					<p v-if="Object.values(appearNote.reactions).some(x => x)" class="count">{{ Object.values(appearNote.reactions).reduce((a, c) => a + c, 0) }}</p>
				</button>
				<button ref="menuButton" class="button" @click="menu()">
					<fa icon="ellipsis-h"/>
				</button>
			</footer>
			<div v-if="appearNote.deletedAt != null" class="deleted">{{ $t('deleted') }}</div>
		</div>
	</article>
	<x-sub v-for="note in replies" :key="note.id" :note="note"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';

import XSub from './note.sub.vue';
import XInstanceTicker from '../../../common/views/components/instance-ticker.vue';
import noteMixin from '../../../common/scripts/note-mixin';
import noteSubscriber from '../../../common/scripts/note-subscriber';

export default Vue.extend({
	i18n: i18n('desktop/views/components/note.vue'),

	components: {
		XSub,
		XInstanceTicker,
	},

	mixins: [
		noteMixin(),
		noteSubscriber('note'),
	],

	inject: {
		narrow: {
			default: false,
		},
	},

	props: {
		note: {
			type: Object,
			required: true,
		},
		detail: {
			type: Boolean,
			required: false,
			default: false,
		},
		compact: {
			type: Boolean,
			required: false,
			default: false,
		},
		preview: {
			type: Boolean,
			required: false,
			default: false,
		},
	},

	data() {
		return {
			conversation: [],
			replies: [],
		};
	},

	created() {
		if (this.detail) {
			this.$root.api('notes/children', {
				noteId: this.appearNote.id,
				limit: 30,
			}).then(replies => {
				this.replies = replies;
			});

			this.$root.api('notes/conversation', {
				noteId: this.appearNote.replyId,
			}).then(conversation => {
				this.conversation = conversation.reverse();
			});
		}
	},
	methods: {
		showTicker() {
			if (this.$store.state.device.instanceTicker === 'always') return true;
			if (this.$store.state.device.instanceTicker === 'remote' && this.appearNote.user.instance) return true;
			return false;
		},
	},
});
</script>

<style lang="css" scoped>
.reply-border {
	border-left: solid 2px var(--primary)
}

.note-reply-frame {
	border: solid 1px var(--primaryAlpha03) !important
}
</style>

<style lang="stylus" scoped>
.note
	margin 0
	padding 0
	overflow hidden
	background var(--face)
	border-radius 6px
	border-bottom solid var(--lineWidth) var(--faceDivider)

	&.mini
		font-size 13px

		> .renote
			padding 8px 16px 0 16px

			.avatar
				width 20px
				height 20px
		> .article
			padding 16px 16px 4px

			> .avatar
				margin 0 10px 8px 0
				width 42px
				height 42px

	&:last-of-type
		border-bottom none

	&:focus
		z-index 1

		&:after
			content ""
			pointer-events none
			position absolute
			top 2px
			right 2px
			bottom 2px
			left 2px
			border 2px solid var(--primaryAlpha03)
			border-radius 4px

	> .renote + article
		padding-top 8px

	> .article
		display flex
		padding 28px 32px 18px 32px

		&:hover
			> .main > footer > button
				color var(--noteActionsHighlighted)

		> .avatar
			flex-shrink 0
			display block
			margin 0 16px 10px 0
			width 58px
			height 58px
			border-radius 8px
			//position -webkit-sticky
			//position sticky
			//top 74px

		> .main
			flex 1
			min-width 0

			> .header
				margin-bottom 4px

			> .body

				> .cw
					cursor default
					display block
					margin 0
					padding 0
					overflow-wrap break-word
					color var(--noteText)

					> .text
						margin-right 8px

				> .content

					> .text
						cursor default
						display block
						margin 0
						padding 0
						overflow-wrap break-word
						color var(--noteText)
						font-size calc(1em + var(--fontSize))

						> .reply
							margin-right 8px
							color var(--text)

						> .rp
							margin-left 4px
							font-style oblique
							color var(--renoteText)

					> .location
						margin 4px 0
						font-size 12px
						color #ccc

					> .map
						width 100%
						height 300px

						&:empty
							display none

					.mk-url-preview
						margin-top 8px

					> .mk-poll
						font-size 80%

					> .renote
						margin 8px 0

						> *
							padding 16px
							border dashed var(--lineWidth) var(--quoteBorder)
							border-radius 8px

			> .footer
				> .app
					display block
					margin-top 0.5em
					margin-left 0.5em
					color var(--noteHeaderInfo)
					font-size 0.8em

				> .button
					margin 0 28px 0 0
					padding 0 8px
					line-height 32px
					font-size 1em
					color var(--noteActions)
					background transparent
					border none
					cursor pointer

					&:last-child
						margin-right 0

					&:hover
						color var(--noteActionsHover)

					&.replyButton:hover
						color var(--noteActionsReplyHover)

					&.renoteButton:hover
						color var(--noteActionsRenoteHover)

					&.reactionButton:hover
						color var(--noteActionsReactionHover)

					&.inhibitedButton
						cursor not-allowed

					> .count
						display inline
						margin 0 0 0 8px
						color var(--text)
						opacity 0.7

					&.reacted, &.reacted:hover
						color var(--noteActionsReactionHover)

			> .deleted
				color var(--noteText)
				opacity 0.7

</style>
