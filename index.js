'use strict';

var each = require('each-async');
var fs = require('fs');
var mkdir = require('mkdirp');
var mv = require('mv');
var path = require('path');
var uuid = require('uuid');

/**
 * Safely move files and directories to trash on Linux
 *
 * @param {String} file
 * @param {Function} cb
 * @api public
 */

function rm(file, cb) {
	var base = process.env.XDG_DATA_HOME || path.join(process.env.HOME,'.local/share');
	var trash = path.join(base, 'Trash');
	var name = uuid.v4();
	var dest = path.join(trash, 'files', name);
	var info = path.join(trash, 'info', name + '.trashinfo');

	var msg = [
		'[Trash Info]',
		'Path=' + file,
		'DeletionDate=' + new Date().toISOString().replace(/\..+/, '')
	].join('\n');

	mkdir(path.join(trash, 'files'), function (err) {
		if (err) {
			cb(err);
			return;
		}

		mkdir(path.join(trash, 'info'), function (err) {
			if (err) {
				cb(err);
				return;
			}

			mv(file, dest, { mkdirp: true }, function (err) {
				if (err) {
					cb(err);
					return;
				}

				fs.writeFile(info, msg, function (err) {
					if (err) {
						cb(err);
						return;
					}

					cb();
				});
			});
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
	if (!Array.isArray(paths)) {
		cb(new Error('`paths` required'));
	}

	cb = cb || function () {};

	paths = paths.map(function (p) {
		return path.resolve(String(p));
	});

	each(paths, function (path, i, next) {
		rm(path, function (err) {
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
