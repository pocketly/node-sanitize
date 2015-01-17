/**
 * @author Adam Jaso <ajaso@pocketly.com>
 * @copyright 2015 Pocketly
 */ 

var _ = require('lodash');
var sanitize = require('..');

var sanitizer = sanitize();

describe('sanitize.js', function() {

  describe('sanitize()', function() {

    describe('value()', function() {

      var tests = [
        // booleans
        {
          type: 'b',
          value: true,
          expected: true
        },
        {
          type: 'b',
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
          type: 'i',
          value: 1,
          expected: 1
        },
        {
          type: 'int',
          value: '1',
          expected: 1
        },
        {
          type: 'integer',
          value: undefined,
          expected: undefined
        },
        {
          type: 'integer',
          value: null,
          expected: NaN
        },
        {
          type: 'i',
          value: 'asdf',
          expected: NaN
        },

        // floats
        {
          type: 'f',
          value: 0.0,
          expected: 0.0
        },
        {
          type: 'flo',
          value: '1.1',
          expected: 1.1
        },
        {
          type: 'float',
          value: null,
          expected: NaN
        },
        {
          type: 'f',
          value: undefined,
          expected: undefined
        },
        {
          type: 'f',
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
          type: 'string',
          value: 'abcde',
          expected: 'abcde'
        },
        {
          type: 'string',
          value: 1,
          expected: '1'
        },
        {
          type: 'string',
          value: null,
          expected: null
        }
      ];

      _.each(tests, function(test) {

        it('should validate ' + test.type + ' with value ' + test.value, function() {

          if (Error === test.expected) {
            (function() {
              sanitize.value(test.value, test.type);
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
            user_id: 'i',
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

  });

  describe('sanitize.Sanitizer', function() {

    it('should support custom filters', function() {

      var MySanitizer = sanitize.Sanitizer.extend({

        customType: function(value) {
          return value + '123456'
        }

      });

      var szr = new MySanitizer();

      szr.customType.should.be.a.function;

      sanitize(MySanitizer).value('abc', 'customType').should.be.eql('abc123456');

    });

    it('should support overriding default filters', function() {

      var theValue = null;

      var MySanitizer = sanitize.Sanitizer.extend({

        integer: function(value) {
          theValue = value;
          return this.super(value);
        }

      });

      sanitize(MySanitizer).value(5, 'i').should.be.eql(theValue);

    });

  });

  describe('sanitize.Aliases', function() {

    it('should support custom aliases', function() {
      var CustomAliases = sanitize.Aliases.extend({
        inty: 'integer'
      });
      var customAliases = new CustomAliases();
      var customSanitizer = new sanitize.Sanitizer(customAliases);
      var mySanitizer = sanitize(customSanitizer);

      mySanitizer.value('1', 'inty').should.be.eql(1);

      (function() {
        mySanitizer.value('1', 'intyy').should.be.eql(1);
      }).should.throw();

    });

  });

});