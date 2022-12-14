/*
 * Tests of MFM
 *
 * How to run the tests:
 * > TS_NODE_FILES=true mocha test/reaction-lib.ts --require ts-node/register
 *
 * To specify test:
 * > TS_NODE_FILES=true mocha test/reaction-lib.ts --require ts-node/register -g 'test name'
 */
/*
import * as assert from 'assert';

import { initTestDb } from './utils';
import { toDbReaction } from '../src/misc/reaction-lib';

describe('toDbReaction', async () => {
	before(async () => {
		await initTestDb();
	});

	it('Unicodeã®ã¾ã¾', async () => {
		assert.strictEqual(await toDbReaction('ð'), 'ð');
	});

	it('ç°ä½å­ã»ã¬ã¯ã¿é¤å»', async () => {
		assert.strictEqual(await toDbReaction('ãï¸'), 'ã');
	});

	it('ç°ä½å­ã»ã¬ã¯ã¿é¤å» å¿è¦ãªã', async () => {
		assert.strictEqual(await toDbReaction('ã'), 'ã');
	});

	it('fallback - undefined', async () => {
		assert.strictEqual(await toDbReaction(undefined), 'â­');
	});

	it('fallback - null', async () => {
		assert.strictEqual(await toDbReaction(null), 'â­');
	});

	it('fallback - empty', async () => {
		assert.strictEqual(await toDbReaction(''), 'â­');
	});

	it('fallback - unknown', async () => {
		assert.strictEqual(await toDbReaction('unknown'), 'â­');
	});
});
*/
