Walkin
======

Node.js Filesystem Walker
[![Build Status](https://travis-ci.org/LlamaSantos/Walkin.png?branch=master)](https://travis-ci.org/LlamaSantos/Walkin)

###Purpose
Provide a consistent API through both an event emitter as well as a callback.  Both API's allow for a flexible one size fits all component.


```JavaScript
//Usage
var Walkin = require("walkin");

var walkin = new Walkin();

walkin.find('./test/**/*.txt', function (err, files){
	console.info(files);
});

// Output
// [./test/dir1/file1.txt, ./test/dir2/file2.txt]
```

In addition direct searching for files will also work.

```JavaScript
// Usage
var Walkin = require('walkin');

var walkin = new Walkin();

walkin.find('./test/**/config.json', function (err, files){
	console.info(files);
});

// Output
// [./test/dir1/config.json, ./test/dir2/config.json]
```

##Authors
Contributions from
	* James R. White
	* Alexander Marinenko

##License

The MIT License (MIT)

Copyright (c) 2014 James R. White

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.