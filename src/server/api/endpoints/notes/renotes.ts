import $ from 'cafy';
import { ID } from '../../../../misc/cafy-id';
import define from '../../define';
import { getNote } from '../../common/getters';
import { ApiError } from '../../error';
import { generateVisibilityQuery } from '../../common/generate-visibility-query';
import { generateMuteQuery } from '../../common/generate-mute-query';
import { makePaginationQuery } from '../../common/make-pagination-query';
import { Notes } from '../../../../models';

export const meta = {
	desc: {
		'ja-JP': '指定した投稿のRenote一覧を取得します。',
		'en-US': 'Show a renotes of a note.'
	},

	tags: ['notes'],

	requireCredential: false,

	params: {
		noteId: {
			validator: $.type(ID),
			desc: {
				'ja-JP': '対象の投稿のID',
				'en-US': 'Target note ID'
			}
		},

		limit: {
			validator: $.optional.num.range(1, 100),
			default: 10
		},

		sinceId: {
			validator: $.optional.type(ID),
		},

		untilId: {
			validator: $.optional.type(ID),
		}
	},

	res: {
		type: 'array' as const,
		optional: false as const, nullable: false as const,
		items: {
			type: 'object' as const,
			optional: false as const, nullable: false as const,
			ref: 'Note',
		}
	},

	errors: {
		noSuchNote: {
			message: 'No such note.',
			code: 'NO_SUCH_NOTE',
			id: '12908022-2e21-46cd-ba6a-3edaf6093f46'
		}
	}
};

export default define(meta, async (ps, user) => {
	const note = await getNote(ps.noteId).catch(e => {
		if (e.id === '9725d0ce-ba28-4dde-95a7-2cbb2c15de24') throw new ApiError(meta.errors.noSuchNote);
		throw e;
	});

	const query = makePaginationQuery(Notes.createQueryBuilder('note'), ps.sinceId, ps.untilId)
		.andWhere(`note.renoteId = :renoteId`, { renoteId: note.id })
		.innerJoinAndSelect('note.user', 'user')
		.leftJoinAndSelect('user.avatar', 'avatar')
		.leftJoinAndSelect('user.banner', 'banner')
		.leftJoinAndSelect('note.reply', 'reply')	// このAPIはQuoteも返すのでいる
		.leftJoinAndSelect('note.renote', 'renote')
		.leftJoinAndSelect('reply.user', 'replyUser')
		.leftJoinAndSelect('replyUser.avatar', 'replyUserAvatar')
		.leftJoinAndSelect('replyUser.banner', 'replyUserBanner')
		.leftJoinAndSelect('renote.user', 'renoteUser')
		.leftJoinAndSelect('renoteUser.avatar', 'renoteUserAvatar')
		.leftJoinAndSelect('renoteUser.banner', 'renoteUserBanner');

	generateVisibilityQuery(query, user);
	if (user) generateMuteQuery(query, user);

	const renotes = await query.take(ps.limit!).getMany();

	return await Notes.packMany(renotes, user);
});
