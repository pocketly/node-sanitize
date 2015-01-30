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

  float: function(value) {
    var arg;
    if (_.isArray(value)) {
      arg = parseInt(value[1]);
      value = value[0];
    }
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
    var protocol;
    var options;
    if (_.isArray(value)) {
      protocol = value[1];
      options = {protocols: [protocol]};
      value = value[0];
    }
    return vtor.isURL(value, options) ? fixUrl(value, protocol) : null;
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

  json: function(value) {
    if (_.isString(value)) {
      try {
        value = JSON.parse(value);
      } catch(e) {
        return null;
      }
    }

    if (_.isPlainObject(value) || _.isObject(value)) {
      return value;
    }

    return null;
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


function fixUrl(url, protocol) {
  if (!url) {
    return url;
  }

  protocol = protocol || 'http';

  // does it start with desired protocol?
  if ((new RegExp('^' + protocol + ':\/\/', 'i')).test(url)) {
    return url;
  }

  // if we have a different protocol, then invalidate
  if (/^\w+:\/\//i.test(url)) {
    return null;
  }

  // apply protocol to "abc.com/abc"
  if (/^(?:\w+\.\w{2,})+(?:\/.*|$)/.test(url)) {
    return protocol + '://' + url;
  }

  return null;
}