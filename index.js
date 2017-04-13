'use strict';

var ES6Set = require('es6-set');
var lstatDir = require('lstat-dir');
var toArray = require('lodash/fp/toArray');

function filterEmptyFiles(map) {
  var filePaths = new ES6Set();

  toArray(map).forEach(function(pathStatPair) {
    if (pathStatPair[1].isFile() && pathStatPair[1].size === 0) {
      filePaths.add(pathStatPair[0]);
    }
  });

  return filePaths;
}

module.exports = function listEmptyFiles(dir, options) {
  return lstatDir(dir, options).then(filterEmptyFiles);
};
