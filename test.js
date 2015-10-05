'use strict';
var fs = require('fs');
var path = require('path');
var test = require('ava');
var pathExists = require('path-exists');
var xdgTrash = require('./');

test('move file to trash', function (t) {
	t.plan(2);

	fs.writeFileSync('f0', '');

	xdgTrash(['f0']).then(function (files) {
		t.assert(!pathExists.sync('f0'), pathExists.sync('f0'));
		t.assert(pathExists.sync(files[0].path), pathExists.sync(files[0].path));
	});
});

test('move file with spaces to trash', function (t) {
	t.plan(2);

	fs.writeFileSync('f 1', '');

	xdgTrash(['f 1']).then(function (files) {
		t.assert(!pathExists.sync('f 1'), pathExists.sync('f 1'));
		t.assert(pathExists.sync(files[0].path), pathExists.sync(files[0].path));
	});
});

test('move directory to trash', function (t) {
	t.plan(2);

	fs.mkdirSync('d0');

	xdgTrash(['d0']).then(function (files) {
		t.assert(!pathExists.sync('d0'), pathExists.sync('d0'));
		t.assert(pathExists.sync(files[0].path), pathExists.sync(files[0].path));
	});
});

test('create trashinfo', function (t) {
	t.plan(1);

	fs.writeFileSync('f2', '');

	var info = [
		'[Trash Info]',
		'Path=' + path.resolve('f2')
	].join('\n');

	xdgTrash(['f2']).then(function (files) {
		var infoFile = fs.readFileSync(files[0].info, 'utf8');
		t.assert(infoFile.trim().indexOf(info.trim()) !== -1, infoFile.trim().indexOf(info.trim()));
	});
});

test('preserve file attributes', function (t) {
	t.plan(4);

	fs.writeFileSync('f3', '');
	var statSrc = fs.statSync('f3');

	xdgTrash(['f3']).then(function (files) {
		var statDest = fs.statSync(files[0].path);
		t.assert(statSrc.mode === statDest.mode, statSrc.mode);
		t.assert(statSrc.uid === statDest.uid, statSrc.uid);
		t.assert(statSrc.gid === statDest.gid, statSrc.gid);
		t.assert(statSrc.size === statDest.size, statSrc.size);
	});
});
