import $ from 'cafy';
import define from '../../define';
import { fetchMeta } from '../../../../misc/fetch-meta';
import { genId } from '../../../../misc/gen-id';
import { SwSubscriptions } from '../../../../models';

export const meta = {
	tags: ['account'],

	requireCredential: true,

	params: {
		endpoint: {
			validator: $.str,
		},

		auth: {
			validator: $.str,
		},

		publickey: {
			validator: $.str,
		},
	},
};

export default define(meta, async (ps, user) => {
	// if already subscribed
	const exist = await SwSubscriptions.findOne({
		userId: user.id,
		endpoint: ps.endpoint,
		auth: ps.auth,
		publickey: ps.publickey,
	});

	const instance = await fetchMeta(true);

	if (exist != null) {
		return {
			state: 'already-subscribed',
			key: instance.swPublicKey,
		};
	}

	await SwSubscriptions.save({
		id: genId(),
		createdAt: new Date(),
		userId: user.id,
		endpoint: ps.endpoint,
		auth: ps.auth,
		publickey: ps.publickey,
	});

	return {
		state: 'subscribed',
		key: instance.swPublicKey,
	};
});
