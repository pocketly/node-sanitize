# node-sanitize
Input sanitizing library for node.js

# Summary
This library is for the purpose of sanitizing user input. The examples below show some of the built in sanitizers. You can create your own custom sanitizers. Please refer to the tests for more examples of how to use this library.

# USAGE

```javascript
var sanitizer = require('sanitize')();
... 
app.get('/', function(req, res) {
    // default supported types
    var myInteger = sanitizer.value(req.header['x-custom-header'], 'int');
    var myBool = sanitizer.value(req.header['x-custom-header'], 'bool');
    var myFloat = sanitizer.value(req.header['x-custom-header'], 'float');
    var myString = sanitizer.value(req.header['x-custom-header'], 'string');
    var myMatchingString = sanitizer.value(req.header['x-custom-header'], /abc123/);
    var myPhoneNumber = sanitizer.value(req.header['x-custom-header'], 'phone');
    var myEmail = sanitizer.value(req.header['x-custom-header'], 'email');
    var myUrl = sanitizer.value(req.header['x-custom-header'], 'url');
});
...
```