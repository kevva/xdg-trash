'use strict';

var fs = require('fs');
var path = require('path');
var test = require('ava');
var trash = require('./');

test('move file to trash', function (t) {
	t.plan(3);

	fs.writeFileSync('f0', '');

	trash(['f0'], function (err, files) {
		t.assert(!err, err);
		t.assert(!fs.existsSync('f0'));
		t.assert(fs.existsSync(files[0].path));
	});
});

test('move file with spaces to trash', function (t) {
	t.plan(3);

	fs.writeFileSync('f 1', '');

	trash(['f 1'], function (err, files) {
		t.assert(!err, err);
		t.assert(!fs.existsSync('f 1'));
		t.assert(fs.existsSync(files[0].path));
	});
});

test('move directory to trash', function (t) {
	t.plan(3);

	fs.mkdirSync('d0');

	trash(['d0'], function (err, files) {
		t.assert(!err, err);
		t.assert(!fs.existsSync('d0'));
		t.assert(fs.existsSync(files[0].path));
	});
});

test('create trashinfo', function (t) {
	t.plan(2);

	fs.writeFileSync('f2', '');

	var info = [
		'[Trash Info]',
		'Path=' + path.resolve('f2')
	].join('\n');

	trash(['f2'], function (err, files) {
		var infoFile = fs.readFileSync(files[0].info, 'utf8');
		t.assert(!err, err);
		t.assert(infoFile.trim().indexOf(info.trim()) !== -1);
	});
});

test('preserve file attributes', function (t) {
	t.plan(5);

	fs.writeFileSync('f3', '');
	var statSrc = fs.statSync('f3');

	trash(['f3'], function (err, files) {
		var statDest = fs.statSync(files[0].path);
		t.assert(!err, err);
		t.assert(statSrc.mode === statDest.mode);
		t.assert(statSrc.uid === statDest.uid);
		t.assert(statSrc.gid === statDest.gid);
		t.assert(statSrc.size === statDest.size);
	});
});

test('set `.noStack` to true when file does not exist', function (t) {
	t.plan(2);

	trash(['f4'], function (err) {
		t.assert(err);
		t.assert(err.noStack);
	});
});
