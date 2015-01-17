/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */

var vtor = require('validator');
var _ = require('lodash');

var Aliases = require('./Aliases');

module.exports = exports = require('sand').Class.extend({

  isSanitizer: true, // duck typing
  aliases: null,

  construct: function(CustomAliases) {

    var aliases;
    if (!_.isUndefined(CustomAliases)) {

      if (_.isFunction(CustomAliases) && CustomAliases.prototype.isAliases) {
        aliases = new CustomAliases();
      } else if (_.isObject(CustomAliases) && CustomAliases.isAliases) {
        aliases = CustomAliases;

      } else {
        throw new Error('Invalid aliases: ' + CustomAliases);
      }

    } else {
      aliases = new Aliases();
    }

    this.aliases = aliases;
  },

  bool: function(value) {
    return _.isBoolean(value) ? value : vtor.toBoolean(value);
  },

  float: function(value, arg) {
    try {
      var flo = parseFloat(value);
      if ('number' === typeof arg) {
        flo = parseFloat(flo.toFixed(arg));
      }

    } catch (e) {
      return null;
    }

    return flo;
  },

  integer: function(value) {
    try {
      return parseInt(value);
    } catch (e) {
      return null;
    }
  },

  phone: function(value) {
    return !_.isNull(value) ? value.replace(/[^0-9]+/ig, '') : null;
  },

  email: function(value) {
    return vtor.isEmail(value) ? value : null;
  },

  url: function(value) {
    return vtor.isURL(value) ? value : null;
  },

  regex: function(value, regex) {
    if (regex && regex instanceof RegExp) {
      return regex.test(value.toString()) ? value.toString() : null;
    } else {
      throw new Error('Invalid regex given: ' + regex);
    }
  },

  func: function(value, func) {
    if (func && _.isFunction(func)) {
      return func(value);
    } else {
      throw new Error('Invalid function: ' + func);
    }
  },

  string: function(value) {
    return !_.isNull(value) ? value.toString() : null;
  },

  getImplicitType: function(type) {
    var arg;
    if (type instanceof RegExp) {
      arg = type;
      type = 'regex';
    } else if (_.isFunction(type)) {
      arg = type;
      type = 'function';

    } else {
      return null;
    }

    return [type, arg];
  }
});