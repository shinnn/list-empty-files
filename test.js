'use strict';

const {join} = require('path');

const listEmptyFiles = require('.');
const rmfr = require('rmfr');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');

test('listEmptyFiles()', async t => {
	await Promise.all(['10', '2'].map(filename => writeFileAtomically(join(__dirname, filename), '')));

	const files = await listEmptyFiles(__dirname, {numeric: true});
	t.ok(files instanceof Set, 'should retrieve a Set instance.');
	t.deepEqual([...files], [
		'2',
		'10'
	].map(path => join(__dirname, path)), 'should list empty files in a directory.');

	await rmfr('{10,2}', {
		glob: {
			cwd: __dirname
		}
	});

	t.equal(
		(await listEmptyFiles(Buffer.from(join(__dirname, 'node_modules')))).size,
		0,
		'should retrieve an empty Set if the directory has no empty files.'
	);

	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await listEmptyFiles('not-found');
		fail();
	} catch ({code}) {
		t.equal(code, 'ENOENT', 'should fail when it cannot find the directory.');
	}

	try {
		await listEmptyFiles([0, 1]);
		fail();
	} catch ({name}) {
		t.equal(name, 'TypeError', 'should fail when it takes a non-string argument.');
	}

	try {
		await listEmptyFiles();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await listEmptyFiles('a', {}, 'b');
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
		);
	}

	t.end();
});
