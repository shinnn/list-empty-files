'use strict';

const lstatDir = require('lstat-dir');

module.exports = async function listEmptyFiles(...args) {
  const paths = new Set();

  for (const [path, stat] of await lstatDir(...args)) {
    if (stat.isFile() && stat.size === 0) {
      paths.add(path);
    }
  }

  return paths;
};
