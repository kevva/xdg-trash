'use strict';

var fs = require('fs');
var path = require('path');
var test = require('ava');
var trash = require('./');

test('move file to trash', function (t) {
	t.plan(4);

	fs.writeFile('ffile', '', function (err) {
		t.assert(!err);

		trash(['ffile'], function (err, files) {
			t.assert(!err);

			fs.exists('ffile', function (exists) {
				t.assert(!exists);

				fs.exists(files[0].path, function (exists) {
					t.assert(exists);
				});
			});
		});
	});
});

test('move directory to trash', function (t) {
	t.plan(4);

	fs.mkdir('fdir', function (err) {
		t.assert(!err, err);

		trash(['fdir'], function (err, files) {
			t.assert(!err);

			fs.exists('fdir', function (exists) {
				t.assert(!exists);

				fs.exists(files[0].path, function (exists) {
					t.assert(exists);
				});
			});
		});
	});
});

test('create trashinfo', function (t) {
	t.plan(4);

	fs.writeFile('finfo', '', function (err) {
		t.assert(!err);

		var info = [
			'[Trash Info]',
			'Path=' + path.resolve('finfo')
		].join('\n');

		trash(['finfo'], function (err, files) {
			t.assert(!err);

			fs.readFile(files[0].info, 'utf8', function (err, data) {
				t.assert(!err);
				t.assert(data.trim().indexOf(info.trim()) !== -1);
			});
		});
	});
});

test('preserve file attributes', function (t) {
	t.plan(5);

	fs.writeFile('fstat', '', function (err) {
		t.assert(!err);

		fs.stat('fstat', function (err, a) {
			t.assert(!err);

			trash(['fstat'], function (err, files) {
				t.assert(!err);

				fs.stat(files[0].path, function (err, b) {
					t.assert(!err);
					t.assert(JSON.stringify(a) === JSON.stringify(b));
				});
			});
		});
	});
});

test('set `.noStack` to true when file doesn\'t exist', function (t) {
	t.plan(2);

	trash(['non-existant-file'], function (err) {
		t.assert(err);
		t.assert(err.noStack);
	});
});
