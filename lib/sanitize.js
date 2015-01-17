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
    }
  };

};

exports.Sanitizer = Sanitizer;
exports.Aliases = Aliases;


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

  return function(value, type, callback) {
    return applySanitizerForType(value, type, sanitizer);
  };
}


function applySanitizerForType(value, type, sanitizer) {

  // if value is undefined, fast fail
  if (_.isUndefined(value)) {
    return value;
  }

  // automatically trim
  value = _.isString(value) ? value.trim() : value;

  var parts;
  if (!_.isString(type)) {
    parts = sanitizer.getImplicitType(type);

    if (!_.isArray(parts)) {
      throw new Error('Invalid type: ' + type);
    }

    type = parts.shift();
    parts.unshift(value);

  } else {
    parts = [value];
  }

  type = sanitizer.aliases.lookup(type);

  return sanitizer[type].apply(sanitizer, parts);

}