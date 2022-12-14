import { User } from '../../models/entities/user';
import { Note } from '../../models/entities/note';
import { NoteWatchings } from '../../models';
import { genId } from '../../misc/gen-id';
import { NoteWatching } from '../../models/entities/note-watching';

export default async (me: User['id'], note: Note) => {
	// 自分の投稿はwatchできない
	if (me === note.userId) {
		return;
	}

	await NoteWatchings.save({
		id: genId(),
		createdAt: new Date(),
		noteId: note.id,
		userId: me,
		noteUserId: note.userId,
	} as NoteWatching);
};
