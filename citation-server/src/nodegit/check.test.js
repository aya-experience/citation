import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const directory = 'directory';
const gitRemote = 'gitRemote';

let check;
let access;
let open;
let lookup;

test.beforeEach(() => {
	access = sinon.stub().returns(Promise.resolve());
	open = sinon.stub().returns(Promise.resolve());
	lookup = sinon.stub().returns(Promise.resolve({
		url: () => Promise.resolve(gitRemote)
	}));
	check = proxyquire('./check', {
		'fs-promise': {access},
		nodegit: {Repository: {open}, Remote: {lookup}},
		winston: {loggers: {get: () => ({debug: () => {}, error: () => {}})}}
	}).default;
});

test('Check return false for non existing directory', async t => {
	access.throws();
	t.false(await check(directory, gitRemote));
});

test('Check return false for empty directory', async t => {
	open.throws();
	t.false(await check(directory, gitRemote));
});

test('Check return false for git directory with wrong remote', async t => {
	lookup.returns(Promise.resolve({
		url: () => Promise.resolve('wrong')
	}));
	t.false(await check(directory, gitRemote));
});

test('Check return true for git directory with right remote', async t => {
	t.true(await check(directory, gitRemote));
});
