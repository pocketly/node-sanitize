/**
 * @author Adam Jaso <ajaso@pocketly.com>
 */ 

var _ = require('lodash');
var Sanitizer = require('./Sanitizer');
var Aliases = require('./Aliases');

module.exports = exports = function(CustomSanitizer) {

  var sanitizer = createSanitizerInstance(CustomSanitizer);
  var filterValue = createFilterValue(sanitizer);

  var my = {};


  for (var name in sanitizer) {
    if (!/^(?:get|construct)/.test(name) && _.isFunction(sanitizer[name])) {
      (function(name) {
        my[name] = function() {
          Array.prototype.push.call(arguments, name);
          return applySanitizerForType.apply(sanitizer, arguments);
        };
      })(name);
    }
  }

  for (var alias in sanitizer.aliases) {
    if (_.isString(sanitizer.aliases[alias])) {
      my[alias] = my[sanitizer.aliases[alias]];
    }
  }

  return {
    my: my,
    value: filterValue,
    primitives: function(obj) {

      var _obj = {};

      _.each(obj, function(val, key) {
        if (_.isString(val) || _.isNumber(val)) {
          _obj[key] = val;
        } else if (_.isBoolean(val)) {
          _obj[key] = val ? 1 : 0;
        }
      });

      return _obj;
    },
    object: function filterProps(props, propTypes, errors) {
      return _.mapValues(propTypes, function(type, name) {
        var filtered = filterValue(props[name], type);
        if (null === filtered && _.isPlainObject(errors)) {
          errors[name] = true;
        }
        return filtered;
      });
    },
    array: function(values, type) {
      var invalid = false;
      var values = _.map(values, function(value) {
        value = filterValue(value, type);
        if (!invalid && ((isNaN(value) && "number" == typeof value) || _.isUndefined(value) || _.isNull(value))) {
          invalid = true;
        }
        return value;
      });
      return !invalid ? values : null;
    }
  };

};

exports.Sanitizer = Sanitizer;
exports.Aliases = Aliases;
exports.middleware = require('./middleware');


function createFilterValue(sanitizer) {

  return function(value, type) {
    return applySanitizerForType.call(sanitizer, value, type);
  };
}

function createSanitizerInstance(CustomSanitizer) {
  var sanitizer;

  if (_.isUndefined(CustomSanitizer)) {
    CustomSanitizer = Sanitizer;
  }

  if (_.isFunction(CustomSanitizer)) {
    sanitizer = new CustomSanitizer();

  } else if (_.isObject(CustomSanitizer) && CustomSanitizer.isSanitizer) {
    sanitizer = CustomSanitizer;

  } else {
    throw new Error('Invalid sanitizer: ' + CustomSanitizer);
  }

  return sanitizer;
}


function applySanitizerForType(value, type) {

  // if value is undefined, fast fail
  if (_.isUndefined(value)) {
    return value;
  }

  // automatically trim
  value = _.isString(value) ? value.trim() : value;

  var parts;
  if (!_.isString(type)) {
    parts = this.getImplicitType(type);

    if (!_.isArray(parts)) {
      throw new Error('Invalid type: ' + type);
    }

    type = parts.shift();
    parts.unshift(value);

  } else {
    parts = [value];
  }

  type = this.aliases.lookup(type);

  return this[type].apply(this, parts);

}