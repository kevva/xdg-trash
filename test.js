import fs from 'fs';
import path from 'path';
import test from 'ava';
import pathExists from 'path-exists';
import fn from './';

test('move file to trash', async t => {
	t.plan(2);

	fs.writeFileSync('f0', '');

	const files = await fn(['f0']);

	t.false(pathExists.sync('f0'));
	t.ok(pathExists.sync(files[0].path));
});

test('move file with spaces to trash', async t => {
	t.plan(2);

	fs.writeFileSync('f 1', '');

	const files = await fn(['f 1']);

	t.false(pathExists.sync('f 1'));
	t.ok(pathExists.sync(files[0].path));
});

test('move directory to trash', async t => {
	t.plan(2);

	fs.mkdirSync('d0');

	const files = await fn(['d0']);

	t.false(pathExists.sync('d0'));
	t.ok(pathExists.sync(files[0].path));
});

test('create trashinfo', async t => {
	t.plan(1);

	fs.writeFileSync('f2', '');

	const info = `[Trash Info]\nPath=${path.resolve('f2')}`;
	const files = await fn(['f2']);
	const infoFile = fs.readFileSync(files[0].info, 'utf8');

	t.ok(infoFile.trim().indexOf(info.trim()) !== -1);
});

test('preserve file attributes', async t => {
	t.plan(4);

	fs.writeFileSync('f3', '');

	const statSrc = fs.statSync('f3');
	const files = await fn(['f3']);
	const statDest = fs.statSync(files[0].path);

	t.is(statSrc.mode, statDest.mode);
	t.is(statSrc.uid, statDest.uid);
	t.is(statSrc.gid, statDest.gid);
	t.is(statSrc.size, statDest.size);
});
