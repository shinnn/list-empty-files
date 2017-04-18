'use strict';

const lstatDir = require('lstat-dir');

function filterEmptyFiles(map) {
  const filePaths = new Set();

  for (const [path, stat] of map) {
    if (stat.isFile() && stat.size === 0) {
      filePaths.add(path);
    }
  }

  return filePaths;
}

module.exports = function listEmptyFiles(...args) {
  return lstatDir(...args).then(filterEmptyFiles);
};
