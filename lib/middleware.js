/**
 * @author Adam Jaso <ajaso@pocketly.com>
 */

"use strict";

var _ = require('lodash');
var sanitizer = require('./sanitize')();

module.exports = exports = function(req, res, next) {
  exports.mixinFilters(req);
  next();
};


exports.mixinFilters = function mixinFilters(req) {
  req.sanitizer = sanitizer;

  // functions to retrieve and filter headers
  req.headerInt = createSanitizeFunc.call(req, 'headers', 'int');
  req.headerFloat = createSanitizeFloat.call(req, 'headers');
  req.headerEmail = createSanitizeFunc.call(req, 'headers', 'email');
  req.headerString = createSanitizeFunc.call(req, 'headers', 'str');
  req.headerPattern = createSanitizePattern.call(req, 'headers');
  req.headerOneOf = createSanitizeOneOf.call(req, 'headers');

  // functions to retrieve and filter body parameters
  req.bodyInt = createSanitizeFunc.call(req, 'body', 'int');
  req.bodyFloat = createSanitizeFloat.call(req, 'body');
  req.bodyEmail = createSanitizeFunc.call(req, 'body', 'email');
  req.bodyString = createSanitizeFunc.call(req, 'body', 'str');
  req.bodyPattern = createSanitizePattern.call(req, 'body');
  req.bodyArray = createSanitizeArray.call(req, 'body');
  req.bodyJson = function() {
    return req.sanitizer.value(req.body, 'json');
  };
  req.bodyObject = function(name, propTypes, errors) {
    return propTypes ? req.sanitizer.object(req.body[name], propTypes, errors) : req.sanitizer.my.object(req.body[name]);
  };
  req.bodyOneOf = createSanitizeOneOf.call(req, 'body');

  // functions to retrieve and filter query params
  req.queryInt = createSanitizeFunc.call(req, 'query', 'int');
  req.queryFloat = createSanitizeFloat.call(req, 'query');
  req.queryEmail = createSanitizeFunc.call(req, 'query', 'email');
  req.queryString = createSanitizeFunc.call(req, 'query', 'str');
  req.queryPattern = createSanitizePattern.call(req, 'query');
  req.queryArray = createSanitizeArray.call(req, 'query');
  req.queryOneOf = createSanitizeOneOf.call(req, 'query');

  // functions to retrieve and filter param middleware
  req.paramInt = createSanitizeFunc.call(req, 'params', 'int');
  req.paramFloat = createSanitizeFloat.call(req, 'params');
  req.paramEmail = createSanitizeFunc.call(req, 'params', 'email');
  req.paramString = createSanitizeFunc.call(req, 'params', 'str');
  req.paramPattern = createSanitizePattern.call(req, 'params');
  req.paramOneOf = createSanitizeOneOf.call(req, 'params');
};

exports.createSanitizeFunc = createSanitizeFunc;
exports.createSanitizeFloat = createSanitizeFloat;
exports.createSanitizePattern = createSanitizePattern;
exports.createSanitizeArray = createSanitizeArray;
exports.createSanitizeOneOf = createSanitizeOneOf;

function createSanitizeFunc(input, type) {
  return function(name) {
    return this.sanitizer.value(this[input][name], type);
  }.bind(this);
}

function createSanitizeFloat(input) {
  return function(name, precision) {
    var value = _.isUndefined(precision) ? this[input][name] : [this[input][name], parseInt(precision)];
    return this.sanitizer.value(value, 'float');
  }.bind(this);
}

function createSanitizePattern(input) {
  return function(name, pattern) {
    return this.sanitizer.value(this[input][name], pattern);
  }.bind(this);
}

function createSanitizeArray(input) {
  var req = this;
  return function(name, arg, type) {
    // we must have a type, so if no type, then use arg
    if (_.isUndefined(type)) {
      type = arg;
      arg = undefined;
    }

    // get raw value
    var value = req[input][name];

    if (!_.isArray(value)) {
      value = [value];
    }

    // if an arg is specified, add the specified arg to all values
    value = !_.isUndefined(arg) ? _.map(value, function(val) {
      return [val, arg] // passing arg as item 2 in the array allows us to pass a regex to validate each item in the array
    }) : value;

    // do sanitize!
    return req.sanitizer.array(value, type)
  }.bind(this);
}

function createSanitizeOneOf(input) {
  return function(name, arr) {
    return this.sanitizer.my.oneOf(this[input][name], arr);
  }.bind(this);
}
