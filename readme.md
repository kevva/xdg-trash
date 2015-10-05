# xdg-trash [![Build Status](http://img.shields.io/travis/kevva/xdg-trash.svg?style=flat)](https://travis-ci.org/kevva/xdg-trash)

> Safely move files and directories to trash on Linux


## Install

```
$ npm install --save xdg-trash
```


## Usage

```js
const xdgTrash = require('xdg-trash');

xdgTrash(['foo.txt', 'bar.tar']).then(files => {
	console.log('Files successfully moved to trash!');
});
```


## API

### xdgTrash(files)

Move files to trash. Returns a promise that resolves the removed files.

#### files

*Required*  
Type: `array`

Files to be moved to trash.


## CLI

See the [trash](https://github.com/sindresorhus/trash#cli) CLI.


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
