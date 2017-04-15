'use strict';

const lstatDir = require('lstat-dir');

function filterEmptyFiles(map) {
  const filePaths = new Set();

  for (const pathStatPair of map) {
    if (pathStatPair[1].isFile() && pathStatPair[1].size === 0) {
      filePaths.add(pathStatPair[0]);
    }
  }

  return filePaths;
}

module.exports = function listEmptyFiles(dir, options) {
  return lstatDir(dir, options).then(filterEmptyFiles);
};
