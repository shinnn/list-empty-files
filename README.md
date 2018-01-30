# list-empty-files

[![npm version](https://img.shields.io/npm/v/list-empty-files.svg)](https://www.npmjs.com/package/list-empty-files)
[![Build Status](https://travis-ci.org/shinnn/list-empty-files.svg?branch=master)](https://travis-ci.org/shinnn/list-empty-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/list-empty-files.svg)](https://coveralls.io/github/shinnn/list-empty-files?branch=master)

List all empty files in a given directory

```javascript
const listEmptyFiles = require('list-empty-files');

/*
  a.txt: 'Hi'
  b.txt: ''
  c.txt: 'Hello'
  d.txt: ''
*/

listEmptyFiles('my-dir').then(files => {
  files;
  /* Set {
    '/Users/example/my-dir/b.txt',
    '/Users/example/my-dir/d.txt'
  } */
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install list-empty-files
```

## API

```javascript
const listEmptyFiles = require('list-empty-files');
```

### listEmptyFiles(*dir*)

*dir*: `string` (directory path)  
*options*: `Object` ([`readdir-sorted`](https://github.com/shinnn/readdir-sorted) options)  
Return: `Promise<Set<string>>`

The promise will be fulfilled with a [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) of strings — absolute paths of all zero byte files included in the given directory.

Options are directly passed to the underlying [`readdir-sorted`](https://github.com/shinnn/readdir-sorted#readdirsortedpath--options) to control the order of results.

```javascript
listEmptyFiles('/empty-files').then(files => {
  const iterator = files.keys();

  iterator.next().value; //=> '/empty-files/10.js'
  iterator.next().value; //=> '/empty-files/2a.js'
  iterator.next().value; //=> '/empty-files/2A.js'
});

listEmptyFiles('/dir', {
  numeric: true,
  caseFirst: 'upper'
}).then(files => {
  const iterator = files.keys();

  iterator.next().value; //=> '/empty-files/2A.js'
  iterator.next().value; //=> '/empty-files/2a.js'
  iterator.next().value; //=> '/empty-files/10.js'
});
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
