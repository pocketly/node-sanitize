# node-sanitize
Input sanitizing library for node.js

# Summary
This library is for the purpose of sanitizing user input. The examples below show some of the built in sanitizers. You can create your own custom sanitizers. Please refer to the tests for more examples of how to use this library.

# Install

```bash
npm install --save sanitize
```

# Test

```bash
npm test
```

# Usage

```javascript
var express = require('express');
var app = express();
app.use(require('sanitize').middleware);
app.get('/ping', function(req, res) {
	var param = req.queryInt('param');
	res.send('pong ' + (typeof param) + ' ' + param);
});
app.listen(8080);
```

# Documentation

## Sanitize Objects

### sanitize.primitives(obj: PlainObject): PlainObject
This will remove all keys from a plain object that are not `String`, `Integer`, or `Boolean`. It's great for sanitizing objects before inserting into the database.

## Express Middleware

### req.headerInt(headerName: String): Integer
### req.headerString(headerName: String): String
### req.headerFloat(headerName: String): Float
### req.headerEmail(headerName: String): String
### req.headerPattern(headerName: String, pattern: RegExp): String
### req.headerOneOf(headerName: String, arr: Array): String

### req.bodyInt(bodyParam: String): Integer
### req.bodyString(bodyParam: String): String
### req.bodyFloat(bodyParam: String): Float
### req.bodyEmail(bodyParam: String): String
### req.bodyPattern(bodyParam: String, pattern: RegExp): String
### req.bodyOneOf(bodyName: String, arr: Array): String

### req.queryInt(queryParam: String): Integer
### req.queryString(queryParam: String): String
### req.queryFloat(queryParam: String): Float
### req.queryEmail(queryParam: String): String
### req.queryPattern(queryParam: String, pattern: RegExp): String
### req.queryOneOf(queryName: String, arr: Array): String

### req.paramInt(paramName: String): Integer
### req.paramString(paramName: String): String
### req.paramFloat(paramName: String): Float
### req.paramEmail(paramName: String): String
### req.paramPattern(paramName: String, pattern: RegExp): String
### req.paramOneOf(paramName: String, arr: Array): String
