'use strict';

const {join} = require('path');

const listEmptyFiles = require('.');
const rmfr = require('rmfr');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');

test('listEmptyFiles()', async t => {
  t.plan(5);

  await Promise.all(['a', 'b'].map(filename => writeFileAtomically(join(__dirname, filename), '')));

  listEmptyFiles(__dirname).then(files => {
    t.ok(files instanceof Set, 'should be fulfilled with a Set instance.');

    t.deepEqual([...files], [
      'a',
      'b'
    ].map(path => join(__dirname, path)), 'should list empty files in a directory.');
  }).then(() => rmfr('{a,b}', {
    glob: {
      cwd: __dirname
    }
  })).catch(t.fail);

  listEmptyFiles('not-found').catch(err => {
    t.strictEqual(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  listEmptyFiles([0, 1]).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a path of the directory (string), but got a non-string value [ 0, 1 ].',
      'should fail when it takes a non-string argument.'
    );
  });

  listEmptyFiles().catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a path of the directory (string), but got a non-string value undefined.',
      'should fail when it takes no arguments.'
    );
  });
});
