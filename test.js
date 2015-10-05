import fs from 'fs';
import path from 'path';
import test from 'ava';
import pathExists from 'path-exists';
import xdgTrash from './';

test('move file to trash', async t => {
	fs.writeFileSync('f0', '');

	const files = await xdgTrash(['f0']);

	t.false(pathExists.sync('f0'));
	t.true(pathExists.sync(files[0].path));
});

test('move file with spaces to trash', async t => {
	fs.writeFileSync('f 1', '');

	const files = await xdgTrash(['f 1']);

	t.false(pathExists.sync('f 1'));
	t.true(pathExists.sync(files[0].path));
});

test('move directory to trash', async t => {
	fs.mkdirSync('d0');

	const files xdgTrash(['d0']);

	t.false(pathExists.sync('d0'));
	t.true(pathExists.sync(files[0].path));
});

test('create trashinfo', async t => {
	fs.writeFileSync('f2', '');

	const info = [
		'[Trash Info]',
		'Path=' + path.resolve('f2')
	].join('\n');

	const files = await xdgTrash(['f2']);
	const infoFile = fs.readFileSync(files[0].info, 'utf8');

	t.is(infoFile.trim().indexOf(info.trim()), 0);
});

test('preserve file attributes', async t => {
	fs.writeFileSync('f3', '');
	const statSrc = fs.statSync('f3');

	const files = await xdgTrash(['f3']);
	const statDest = fs.statSync(files[0].path);

	t.is(statSrc.mode, statDest.mode);
	t.is(statSrc.uid, statDest.uid);
	t.is(statSrc.gid, statDest.gid);
	t.is(statSrc.size, statDest.size);
});

test('set `.noStack` to true when file does not exist', asyc t => {
	try {
		await xdgTrash(['f4']);
	} catch (err) {
		t.true(err.noStack);
	}
});
