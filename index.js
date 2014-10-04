'use strict';

var each = require('each-async');
var fs = require('fs');
var mkdir = require('mkdirp');
var mv = require('mv');
var path = require('path');
var uuid = require('uuid');

/**
 * Safely move files and directories to trash
 *
 * @param {Array} files
 * @param {Function} cb
 * @api public
 */

module.exports = function (files, cb) {
	var home = process.env.XDG_DATA_HOME || path.join(process.env.HOME,'.local/share');
	var trash = path.join(home, 'Trash');

	if (!Array.isArray(files)) {
		cb(new Error('`files` required'));
	}

	files = files.map(function (el) {
		return path.resolve(String(el));
	});

	each(files, function (file, i, next) {
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
				next(err);
				return;
			}

			mkdir(path.join(trash, 'info'), function (err) {
				if (err) {
					next(err);
					return;
				}

				mv(file, dest, { mkdirp: true }, function (err) {
					if (err) {
						next(err);
						return;
					}

					fs.writeFile(info, msg, function (err) {
						if (err) {
							next(err);
							return;
						}

						next();
					});
				});
			});
		});
	}, function (err) {
		if (err) {
			cb(err);
			return;
		}

		cb();
	});
};
