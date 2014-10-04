# trash-linux [![Build Status](http://img.shields.io/travis/kevva/trash-linux.svg?style=flat)](https://travis-ci.org/kevva/trash-linux)

> Safely move files and directories to trash on Linux

## Install

```sh
$ npm install --save trash-linux
```

## Usage

```js
var trash = require('trash-linux');

trash(['foo.txt', 'bar.tar'], function (err) {
	if (err) {
		throw err;
	}

	console.log('Files successfully moved to trash!');
})
```

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
