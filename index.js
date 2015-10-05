'use strict';
var path = require('path');
var fsExtra = require('fs-extra');
var uuid = require('uuid');
var xdgTrashdir = require('xdg-trashdir');
var Promise = require('pinkie-promise');
var pify = require('pify');

var fs = pify.all(fsExtra);

function trash(src) {
	var name = uuid.v4();

	return xdgTrashdir(src)
		.then(function (dir) {
			var dest = path.join(dir, 'files', name);
			var info = path.join(dir, 'info', name + '.trashinfo');
			var msg = [
				'[Trash Info]',
				'Path=' + src.replace(/\s/g, '%20'),
				'DeletionDate=' + new Date().toISOString()
			].join('\n');

			return Promise.all([
				fs.move(src, dest, {mkdirp: true}).then(function () {
					return dest;
				}),
				fs.outputFile(info, msg).then(function () {
					return info;
				})
			]);
		})
		.then(function (result) {
			return {
				path: result[0],
				info: result[1]
			};
		})
		.catch(function (err) {
			if (err.code === 'ENOENT') {
				err.noStack = true;
			}
		});
}

module.exports = function (paths) {
	if (process.platform !== 'linux') {
		return Promise.reject(new Error('Only Linux systems are supported'));
	}

	if (!Array.isArray(paths)) {
		return Promise.reject(new Error('Please supply an array of filepaths'));
	}

	if (paths.length === 0) {
		return Promise.resolve();
	}

	paths = paths.map(function (p) {
		return trash(path.resolve(String(p)));
	});

	return Promise.all(paths);
};
