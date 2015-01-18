/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */ 

var sanitizer = require('./sanitize')();

module.exports = exports = function(req, res, next) {
  exports.mixinFilters(req);
  next();
};


exports.mixinFilters = function mixinFilters(req) {
  req.sanitizer = sanitizer;

  // functions to retrieve and filter headers
  req.headerInt = function(name) {
    return req.sanitizer.value(req.headers[name], 'int');
  };
  req.headerFloat = function(name) {
    return req.sanitizer.value(req.headers[name], 'flo');
  };
  req.headerEmail = function(name) {
    return req.sanitizer.value(req.headers[name], 'email');
  };
  req.headerString = function(name) {
    return req.sanitizer.value(req.headers[name], 'str');
  };
  req.headerPattern = function(name, pattern) {
    return req.sanitizer.value(req.headers[name], pattern);
  };

  // functions to retrieve and filter body parameters
  req.bodyInt = function(name) {
    return req.sanitizer.value(req.body[name], 'int');
  };
  req.bodyFloat = function(name) {
    return req.sanitizer.value(req.body[name], 'flo');
  };
  req.bodyEmail = function(name) {
    return req.sanitizer.value(req.body[name], 'email');
  };
  req.bodyString = function(name) {
    return req.sanitizer.value(req.body[name], 'str');
  };
  req.bodyPattern = function(name, pattern) {
    return req.sanitizer.value(req.body[name], pattern);
  };

  // functions to retrieve and filter query params
  req.queryInt = function(name) {
    return req.sanitizer.value(req.query[name], 'int');
  };
  req.queryFloat = function(name) {
    return req.sanitizer.value(req.query[name], 'flo');
  };
  req.queryEmail = function(name) {
    return req.sanitizer.value(req.query[name], 'email');
  };
  req.queryString = function(name) {
    return req.sanitizer.value(req.query[name], 'str');
  };
  req.queryPattern = function(name, pattern) {
    return req.sanitizer.value(req.query[name], pattern);
  };

  // functions to retrieve and filter param middleware
  req.paramInt = function(name) {
    return req.sanitizer.value(req.params[name], 'int');
  };
  req.paramFloat = function(name) {
    return req.sanitizer.value(req.params[name], 'flo');
  };
  req.paramEmail = function(name) {
    return req.sanitizer.value(req.params[name], 'email');
  };
  req.paramString = function(name) {
    return req.sanitizer.value(req.params[name], 'str');
  };
  req.paramPattern = function(name, pattern) {
    return req.sanitizer.value(req.params[name], pattern);
  };

  req.bodyJson = function() {
    return req.sanitizer.value(req.body, 'json');
  };
};