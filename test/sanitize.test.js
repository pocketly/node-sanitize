/**
 * @author Adam Jaso <ajaso@pocketly.com>
 */

"use strict";

var _ = require('lodash');
var sanitize = require('..');

var sanitizer = sanitize();

describe('sanitize.js', function() {


  describe('sanitize()', function() {

    describe('value()', function() {

      var tests = [
        // booleans
        {
          type: 'bool',
          value: true,
          expected: true
        },
        {
          type: 'bool',
          value: false,
          expected: false
        },
        {
          type: 'bool',
          value: null,
          expected: false
        },

        // integers
        {
          type: 'int',
          value: 1,
          expected: 1
        },
        {
          type: 'int',
          value: '1',
          expected: 1
        },
        {
          type: 'int',
          value: undefined,
          expected: undefined
        },
        {
          type: 'int',
          value: null,
          expected: NaN
        },
        {
          type: 'int',
          value: 'asdf',
          expected: NaN
        },

        // floats
        {
          type: 'float',
          value: 0.0,
          expected: 0.0
        },
        {
          type: 'float',
          value: '1.1',
          expected: 1.1
        },
        {
          type: 'float',
          value: ['1.123456', 2],
          expected: 1.12
        },
        {
          type: 'float',
          value: null,
          expected: NaN
        },
        {
          type: 'float',
          value: undefined,
          expected: undefined
        },
        {
          type: 'float',
          value: 'a1asdf',
          expected: NaN
        },

        // phone numbers
        {
          type: 'phone',
          value: '408-123-4567',
          expected: '4081234567'
        },
        {
          type: 'phone',
          value: '(408) 123 - 4567',
          expected: '4081234567'
        },
        {
          type: 'phone',
          value: '',
          expected: ''
        },
        {
          type: 'phone',
          value: null,
          expected: null
        },
        {
          type: 'phone',
          value: undefined,
          expected: undefined
        },

        // emails
        {
          type: 'email',
          value: 'test@test.com',
          expected: 'test@test.com'
        },
        {
          type: 'email',
          value: 'test',
          expected: null
        },
        {
          type: 'email',
          value: '',
          expected: null
        },
        {
          type: 'email',
          value: null,
          expected: null
        },
        {
          type: 'email',
          value: undefined,
          expected: undefined
        },

        // urls
        {
          type: 'url',
          value: 'http://grooveshark.com/#!/search?q=funky+music',
          expected: 'http://grooveshark.com/#!/search?q=funky+music'
        },
        {
          type: 'url',
          value: 'grooveshark.com/#!/search?q=funky+music',
          expected: 'http://grooveshark.com/#!/search?q=funky+music'
        },
        {
          type: 'url',
          value: ['grooveshark.com/#!/search?q=funky+music', 'sftp'],
          expected: 'sftp://grooveshark.com/#!/search?q=funky+music'
        },
        {
          type: 'url',
          value: ['sftp://grooveshark.com/#!/search?q=funky+music', 'sftp'],
          expected: 'sftp://grooveshark.com/#!/search?q=funky+music'
        },
        {
          type: 'url',
          value: ['http://grooveshark.com/#!/search?q=funky+music', 'sftp'],
          expected: null
        },
        {
          type: 'url',
          value: '',
          expected: null
        },
        {
          type: 'url',
          value: '://asdf',
          expected: null
        },
        {
          type: 'url',
          value: null,
          expected: null
        },
        {
          type: 'url',
          value: undefined,
          expected: undefined
        },

        // regexes
        {
          type: /123/i,
          value: 'abc123',
          expected: 'abc123'
        },
        {
          type: /abc123/,
          value: 'ABC123',
          expected: null
        },
        {
          type: /1/,
          value: null,
          expected: Error
        },
        {
          type: /1/,
          value: undefined,
          expected: undefined
        },

        // custom functions
        {
          type: function(value) {
            return value.toString() + '123';
          },
          value: 'abc',
          expected: 'abc123'
        },
        {
          type: function(value) {
            return null
          },
          value: '',
          expected: null
        },


        // strings
        {
          type: 'str',
          value: 'abcde',
          expected: 'abcde'
        },
        {
          type: 'str',
          value: 1,
          expected: '1'
        },
        {
          type: 'str',
          value: null,
          expected: null
        },
        {
          type: 'str',
          value: undefined,
          expected: undefined
        },
        {
          type: 'string',
          value: Error,
          expected: Error
        },

        // json
        {
          type: 'json',
          value: '{"id": 1, "name": "watson"}',
          expected: {id: 1, name: 'watson'}
        },
        {
          type: 'json',
          value: '{',
          expected: null
        },
        {
          type: 'json',
          value: null,
          expected: null
        },
        {
          type: 'json',
          value: undefined,
          expected: undefined
        },

        // arrays
        {
          type: 'array',
          value: [1,2,3],
          expected: [1,2,3]
        },
        {
          type: 'array',
          value: [1,2,3],
          expected: [1,2,3]
        },
        {
          type: 'array',
          value: '',
          expected: null
        },

        // objects
        {
          type: 'obj',
          value: new Date,
          expected: new Date
        },
        {
          type: 'pojo',
          value: new Date,
          expected: null
        },
        {
          type: 'pojo',
          value: {},
          expected: {}
        },
      ];

      _.each(tests, function(test) {

        it('should validate ' + test.type + ' with value ' + test.value, function() {

          if (Error === test.expected) {
            (function() {
              sanitizer.value(test.value, test.type);
            }).should.throw();
          } else if (null !== test.expected && undefined !== test.expected) {
            test.expected.should.eql(sanitizer.value(test.value, test.type));
          } else {
            (test.expected === sanitizer.value(test.value, test.type)).should.be.ok;
          }

        });

      });

    });

    describe('object()', function() {

      var tests = [
        // valid object
        {
          shouldBe: 'should be valid by',
          required: [],
          value: {
            user_id: 1,
            password: 'abc123',
            email: 'test@test.com'
          },
          types: {
            user_id: 'int',
            password: 'str',
            email: 'email'
          }
        },

        // invalid field that is required
        {
          shouldBe: 'should be invalidated by',
          required: ['user_id'],
          value: {
            user_id: undefined,
            password: 'abc123',
            email: 'test@test.com'
          },
          types: {
            user_id: 'str',
            password: 'str',
            email: 'email'
          }
        },

        {
          shouldBe: 'should be invalidated by',
          required: ['user_id'],
          value: {
            user_id: null,
            password: 'abc123',
            email: 'test@test.com'
          },
          types: {
            user_id: 'str',
            password: 'str',
            email: 'email'
          }
        },

        {
          shouldBe: 'should be invalidated by',
          required: ['email'],
          value: {
            user_id: 1,
            password: 'abc123',
            email: 'test'
          },
          types: {
            user_id: 'str',
            password: 'str',
            email: 'email'
          }
        }
      ];

      _.each(tests, function(test) {

        it('a plain object ' + JSON.stringify(test.value) + ' ' + test.shouldBe + ' ' + JSON.stringify(test.types), function() {

          var errors = {};
          sanitizer.object(test.value, test.types, errors);
          if (test.required.length) {
            for (var prop in test.required) {
              test.required[prop].should.be.ok;
            }
          }

        });

      });

    });

    describe('primitive()', function() {

      it('should remove all non strings and numbers and convert booleans to 1 or 0', function() {

        var sanitized = sanitizer.primitives({id: 1, name: 'Joe', age: undefined, gender: null, is_subscribed: true});
        var expected = {id: 1, name: 'Joe', is_subscribed: 1};
        sanitized.should.eql(expected);
        sanitized.hasOwnProperty('age').should.not.be.ok;

      });

    });

    describe('array()', function() {

      var tests = [
        {
          shouldBe: 'should validate an array of valid values',
          expected: [1,2,3],
          values: ['1','2','3'],
          type: 'int'
        },
        {
          shouldBe: 'should invalidate an array with at least one invalid value',
          expected: null,
          values: ['1',null,'3'],
          type: 'int'
        },
        {
          shouldBe: 'should invalidate an array with a NaN',
          expected: null,
          values: ['1',NaN,'3'],
          type: 'int'
        },
        {
          shouldBe: 'should invalidate an array with an undefined',
          expected: null,
          values: ['1',undefined,'3'],
          type: 'int'
        }
      ];

      _.each(tests, function(test) {

        it(test.shouldBe, function() {
          if (test.expected) {
            test.expected.should.be.eql(sanitizer.array(test.values, test.type));
          } else {
            (test.expected === sanitizer.array(test.values, test.type)).should.be.ok;
          }
        });

      });

    });

    describe('oneOf()', function() {

      var tests = [
        {
          shouldBe: 'should validate a string if it is within finite list',
          expected: 'abc',
          value: 'abc',
          arr: ['abc', 'def', 'ghi']
        },
        {
          shouldBe: 'should invalidate a string if it is not within finite list',
          expected: null,
          value: 'jkl',
          arr: ['abc', 'def', 'ghi']
        },
        {
          shouldBe: 'should invalidate a string if finite list is not an array',
          expected: null,
          value: "456",
          arr: "456"
        }
      ];

      _.each(tests, function(test) {

        it(test.shouldBe, function() {
            console.log(sanitizer);
          if (test.expected) {
            test.expected.should.be.eql(sanitizer.my.oneOf(test.value, test.arr));
          } else {
            (test.expected === sanitizer.my.oneOf(test.value, test.arr)).should.be.ok;
          }
        });

      });

    });

  });

  describe('sanitize.my', function() {

    it('should have sanitizing functions directly attached to it', function() {

      sanitizer.my.int('1').should.eql(1);
      sanitizer.my.str('asdf').should.eql('asdf');
      (sanitizer.my.str(null) === null).should.be.ok;
      (sanitizer.my.str(undefined) === undefined).should.not.be.ok;
      (sanitizer.my.email('asdf') === null).should.be.ok;
      sanitizer.my.regex('asdf', /asdf/i).should.eql('asdf');
      sanitizer.my.float(['1.2345', 2]).should.be.eql(1.23);
      sanitizer.my.oneOf(2, [1, 2, 3]).should.be.eql(2);

    });

  });

  describe('sanitize.middleware', function() {

    var req = {
      query: {
        name1: '2.1234',
        name2: [
          '2.1234',
          '3.1234'
        ],
        name3: '123',
        name4: 'asdf@asdf.com',
        name5: 'abc1def2ghi3'
      }
    };

    sanitize.middleware.mixinFilters(req);

    it('should sanitize float numbers', function() {
      (2.1234).should.be.eql(req.queryFloat('name1'));
    });

    it ('should sanitize float numbers with precision', function() {
      (2.12).should.be.eql(req.queryFloat('name1', 2));
    });

    it ('should sanitize arrays of items', function() {
      [2.1234, 3.1234].should.be.eql(req.queryArray('name2', 'float'));
    });

    it ('should sanitize arrays of items with an arg applied to each item', function() {
      [2.12, 3.12].should.be.eql(req.queryArray('name2', 2, 'float'))
    });

    it ('should sanitize integer numbers', function() {
      (123).should.be.eql(req.queryInt('name3'));
    });

    it ('should sanitize emails', function() {
      ('asdf@asdf.com').should.be.eql(req.queryEmail('name4'));
    });

    it ('should sanitize strings', function() {
      ('asdf@asdf.com').should.be.eql(req.queryString('name4'));
    });

    it('should sanitize patterns', function() {
      ('abc1def2ghi3').should.be.eql(req.queryPattern('name5', /(\w{3}\d)+/))
    });

    it('should sanitize one of', function() {
      ('123').should.be.eql(req.queryOneOf('name3', ['123', '456']));
    })
  });

  describe('sanitize.Sanitizer', function() {

    it('should support custom filters', function() {

      class MySanitizer extends sanitize.Sanitizer {
        customType(value) {
          return value + '123456';
        }
      }

      var szr = new MySanitizer();


      sanitize(MySanitizer).value('abc', 'customType').should.be.eql('abc123456');

    });

    it('should support overriding default filters', function() {

      var theValue = null;

      class MySanitizer extends sanitize.Sanitizer {
        int(value) {
          theValue = value;
          return super.int(value);
        }
      }

      sanitize(MySanitizer).value(5, 'int').should.be.eql(theValue);

    });

  });

});