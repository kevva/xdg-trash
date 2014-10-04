'use strict';

var fs = require('fs');
var test = require('ava');
var trash = require('./');

test('remove file', function (t) {
	t.plan(2);

	fs.writeFile('ffile', '', function (err) {
		t.assert(!err);

		trash(['ffile'], function (err) {
			t.assert(!err);

			fs.exists('ffile', function (exists) {
				t.assert(!exists);
			});
		});
	});
});

test('remove directory', function (t) {
	t.plan(3);

	fs.mkdir('fdir', function (err) {
		t.assert(!err, err);

		trash(['fdir'], function (err) {
			t.assert(!err);

			fs.exists('fdir', function (exists) {
				t.assert(!exists);
			});
		});
	});
});
