'use strict';

var each = require('each-async');
var fs = require('fs-extra');
var path = require('path');
var trashdir = require('xdg-trashdir');
var uuid = require('uuid');

/**
 * Safely move files and directories to trash on Linux
 *
 * @param {String} src
 * @param {Function} cb
 * @api private
 */

function trash(src, cb) {
	trashdir(src, function (err, dir) {
		if (err) {
			cb(err);
			return;
		}

		var name = uuid.v4();
		var dest = path.join(dir, 'files', name);
		var info = path.join(dir, 'info', name + '.trashinfo');

		var msg = [
			'[Trash Info]',
			'Path=' + src,
			'DeletionDate=' + new Date().toISOString()
		].join('\n');

		fs.move(src, dest, { mkdirp: true }, function (err) {
			if (err) {
				cb(err);
				return;
			}

			fs.outputFile(info, msg, function (err) {
				if (err) {
					cb(err);
					return;
				}

				cb(null, { path: dest, info: info });
			});
		});
	});
}

/**
 * Module exports
 *
 * @param {Array} paths
 * @param {Function} cb
 * @api public
 */

module.exports = function (paths, cb) {
	var files = [];
	cb = cb || function () {};

	if (process.platform !== 'linux') {
		cb(new Error('Only Linux systems are supported'));
		return;
	}

	if (!Array.isArray(paths)) {
		cb(new Error('`paths` is required'));
		return;
	}

	paths = paths.map(function (p) {
		return path.resolve(String(p));
	});

	each(paths, function (path, i, next) {
		trash(path, function (err, file) {
			if (err) {
				next(err);
				return;
			}

			files.push(file);
			next();
		});
	}, function (err) {
		if (err) {
			cb(err);
			return;
		}

		cb(null, files);
	});
};
