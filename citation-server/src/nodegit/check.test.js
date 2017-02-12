import path from 'path';
import test from 'ava';
import check from './check';

const gitRemote = 'git@github.com:aya-experience/citation-test-check.git';
const fixtureDirectory = path.resolve(__dirname, '../../test/fixtures/check');

test('Check return false for non existing directory', async t => {
	const dir = path.resolve(fixtureDirectory, 'nonExisting');
	t.false(await check(dir, gitRemote));
});

test('Check return false for empty directory', async t => {
	const dir = path.resolve(fixtureDirectory, 'empty');
	t.false(await check(dir, gitRemote));
});

test('Check return false for git directory with wrong remote', async t => {
	const dir = path.resolve(fixtureDirectory, 'wrongRemote');
	t.false(await check(dir, gitRemote));
});

test('Check return true for git directory with right remote', async t => {
	const dir = path.resolve(fixtureDirectory, 'ok');
	t.true(await check(dir, gitRemote));
});
