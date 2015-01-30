/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */ 

var _ = require('lodash');
var Sanitizer = require('./Sanitizer');
var Aliases = require('./Aliases');

module.exports = exports = function(CustomSanitizer) {

  var filterValue = createSanitizerFromSpec(CustomSanitizer);

  return {
    value: filterValue,
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
        if (!invalid && (isNaN(value) || _.isUndefined(value) || _.isNull(value))) {
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


function createSanitizerFromSpec(CustomSanitizer) {

  var sanitizer;

  if (_.isUndefined(CustomSanitizer)) {
    CustomSanitizer = Sanitizer;
  }

  if (_.isFunction(CustomSanitizer) && CustomSanitizer.prototype.isSanitizer) {
    sanitizer = new CustomSanitizer();

  } else if (_.isObject(CustomSanitizer) && CustomSanitizer.isSanitizer) {
    sanitizer = CustomSanitizer;

  } else {
    throw new Error('Invalid sanitizer: ' + CustomSanitizer);
  }

  return function(value, type) {
    return applySanitizerForType.call(sanitizer, value, type);
  };
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