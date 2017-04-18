'use strict';

const {join} = require('path');

const listEmptyFiles = require('.');
const rmfr = require('rmfr');
const test = require('tape');
const writeFileAtomically = require('write-file-atomically');

test('listEmptyFiles()', async t => {
  t.plan(7);

  await Promise.all(['10', '2'].map(filename => writeFileAtomically(join(__dirname, filename), '')));

  listEmptyFiles(__dirname, {numeric: true}).then(files => {
    t.ok(files instanceof Set, 'should be fulfilled with a Set instance.');

    t.deepEqual([...files], [
      '2',
      '10'
    ].map(path => join(__dirname, path)), 'should list empty files in a directory.');
  }).then(() => rmfr('{10,2}', {
    glob: {
      cwd: __dirname
    }
  })).catch(t.fail);

  listEmptyFiles(join(__dirname, 'node_modules')).then(files => {
    t.strictEqual(
      files.size,
      0,
      'should be fulfilled with an empty Set if the directory contains no empty files.'
    );
  }).catch(t.fail);

  listEmptyFiles('not-found').catch(err => {
    t.strictEqual(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  listEmptyFiles([0, 1]).catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected a directory path (string), but got [ 0, 1 ] (array).',
      'should fail when it takes a non-string argument.'
    );
  });

  listEmptyFiles().catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got no arguments.',
      'should fail when it takes no arguments.'
    );
  });

  listEmptyFiles('a', {}, 'b').catch(err => {
    t.strictEqual(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got 3 arguments.',
      'should fail when it takes too many arguments.'
    );
  });
});
