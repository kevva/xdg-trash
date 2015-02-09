# xdg-trash [![Build Status](http://img.shields.io/travis/kevva/xdg-trash.svg?style=flat)](https://travis-ci.org/kevva/xdg-trash)

> Safely move files and directories to trash on Linux

## Install

```sh
$ npm install --save xdg-trash
```

## Usage

```js
var xdgTrash = require('xdg-trash');

xdgTrash(['foo.txt', 'bar.tar'], function (err) {
	if (err) {
		throw err;
	}

	console.log('Files successfully moved to trash!');
});
```

## CLI

See the [trash](https://github.com/sindresorhus/trash#cli) CLI.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
