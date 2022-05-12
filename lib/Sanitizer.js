/**
 * @author Adam Jaso <ajaso@pocketly.com>
 */

"use strict";

var vtor = require('validator');
var _ = require('lodash');

class Sanitizer {

  bool(value) {
    return _.isBoolean(value) ? value : vtor.toBoolean((value || '') + '');
  }

  float(value) {
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
  }

  int(value) {
    try {
      return parseInt(value);
    } catch (e) {
      return null;
    }
  }

  array(arr) {
    return _.isArray(arr) ? arr : null;
  }

  pojo(obj) {
    return _.isPlainObject(obj) ? obj : null;
  }

  obj(obj) {
    return _.isObject(obj) ? obj : null;
  }

  phone(value) {
    return !_.isNull(value) ? value.replace(/[^0-9]+/ig, '') : null;
  }

  email(value) {
    return vtor.isEmail(value || '') ? value : null;
  }

  url(value) {
    var protocol;
    var options;
    if (_.isArray(value)) {
      protocol = value[1];
      options = { protocols: [protocol] };
      value = value[0];
    }
    return vtor.isURL(value || '', options) ? fixUrl(value, protocol) : null;
  }

  regex(value, regex) {
    if (regex && regex instanceof RegExp) {
      return regex.test(value.toString()) ? value.toString() : null;
    } else {
      throw new Error('Invalid regex given: ' + regex);
    }
  }

  func(value, func) {
    if (func && _.isFunction(func)) {
      return func(value);
    } else {
      throw new Error('Invalid function: ' + func);
    }
  }

  str(value) {
    return !_.isNull(value) && !_.isUndefined(value) ? value.toString() : null;
  }

  json(value) {
    if (_.isString(value)) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        return null;
      }
    }

    if (_.isPlainObject(value) || _.isObject(value)) {
      return value;
    }

    return null;
  }

  oneOf(value, arr) {
    if (!_.isArray(arr) || arr.indexOf(value) < 0) {
      return null;
    }

    return value;
  }

  getImplicitType(type) {
    var arg;
    if (type instanceof RegExp) {
      arg = type;
      type = 'regex';
    } else if (_.isFunction(type)) {
      arg = type;
      type = 'func';

    } else {
      return null;
    }

    return [type, arg];
  }
}

module.exports = exports = Sanitizer;


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
  if (/^(?:\w+)(?:\.\w{2,})+(?:\/.*)?/.test(url)) {
    return protocol + '://' + url;
  }

  return null;
}