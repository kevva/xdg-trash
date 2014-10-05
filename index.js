'use strict';

var each = require('each-async');
var fs = require('fs-extra');
var mv = require('mv');
var path = require('path');
var uuid = require('uuid');

/**
 * Safely move files and directories to trash on Linux
 *
 * @param {String} src
 * @param {Function} cb
 * @api public
 */

function trash(src, cb) {
	var home = process.env.XDG_DATA_HOME || path.join(process.env.HOME,'.local/share');
	var name = uuid.v4();
	var dest = path.join(home, 'Trash/files', name);
	var info = path.join(home, 'Trash/info', name + '.trashinfo');

	var msg = [
		'[Trash Info]',
		'Path=' + src,
		'DeletionDate=' + new Date().toISOString()
	].join('\n');

	mv(src, dest, { mkdirp: true }, function (err) {
		if (err) {
			cb(err);
			return;
		}

		fs.outputFile(info, msg, function (err) {
			if (err) {
				cb(err);
				return;
			}

			cb();
		});
	});
}

/**
 * Module exports
 *
 * @param {Array} paths
 * @param {Function} cb
 */

module.exports = function (paths, cb) {
	cb = cb || function () {};

	if (process.platform !== 'linux') {
		cb(new Error('Only Linux systems are supported'));
	}

	if (!Array.isArray(paths)) {
		cb(new Error('`paths` is required'));
	}

	paths = paths.map(function (p) {
		return path.resolve(String(p));
	});

	each(paths, function (path, i, next) {
		trash(path, function (err) {
			if (err) {
				next(err);
				return;
			}

			next();
		});
	}, function (err) {
		if (err) {
			cb(err);
			return;
		}

		cb();
	});
};
