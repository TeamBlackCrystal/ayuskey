import { EntityRepository, Repository } from 'typeorm';
import { PageLike } from '@ayuskey/models';
import { Pages } from '..';
import { ensure } from '@ayuskey/shared';

@EntityRepository(PageLike)
export class PageLikeRepository extends Repository<PageLike> {
	public async pack(
		src: PageLike['id'] | PageLike,
		me?: any,
	) {
		const like = typeof src === 'object' ? src : await this.findOne(src).then(ensure);

		return {
			id: like.id,
			page: await Pages.pack(like.page || like.pageId, me),
		};
	}

	public packMany(
		likes: any[],
		me: any,
	) {
		return Promise.all(likes.map(x => this.pack(x, me)));
	}
}
