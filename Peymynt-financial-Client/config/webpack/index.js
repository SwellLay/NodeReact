'use strict';

const dev = require('./Dev');
const local = require('./Local');
const dist = require('./Dist');
const prod = require('./Prod');
const pre = require('./Pre');

module.exports = {
  local,
  dev,
  dist,
  prod,
  pre
};
