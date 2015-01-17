/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */ 

module.exports = exports = require('sand').Class.extend({

  isAliases: true, // duck typing

  b: 'bool',
  bool: 'bool',

  f: 'float',
  flo: 'float',
  float: 'float',

  i: 'integer',
  int: 'integer',
  integer: 'integer',

  phone: 'phone',

  email: 'email',

  url: 'url',

  re: 'regex',
  regex: 'regex',

  fun: 'func',
  func: 'func',
  function: 'func',

  str: 'string',
  string: 'string',

  lookup: function(alias) {
    return this[alias] || alias;
  }
});