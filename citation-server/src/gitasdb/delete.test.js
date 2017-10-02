import path from 'path';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const workingDirectory = 'content';

let existsSync;
let remove;
let create;

let deleteEntry;

test.beforeEach(() => {
	existsSync = sinon.stub();
	remove = sinon.stub().returns(Promise.resolve([]));
	create = sinon.stub();
	deleteEntry = proxyquire('./delete', {
		'./constants': { workingDirectory },
		'fs-extra': { existsSync, remove },
		'../nodegit/wrapper': { create },
		winston: { loggers: { get: () => ({ debug: () => {}, error: () => {} }) } }
	});
});

test('deleteEntry should return the expected datas', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	const add = () => Promise.resolve(null);
	const commit = () => Promise.resolve(null);
	const push = () => Promise.resolve(null);
	create.withArgs(repositoryPath).returns(Promise.resolve({ add, commit, push }));
	existsSync.withArgs(dataPath).returns(true);
	t.deepEqual(await deleteEntry.deleteEntry(type, { __id__: id }), {
		__id__: id,
		message: `${type} ${id} was successfully deleted`
	});
});

test.serial('deleteEntry should call remove if the folder exists', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	const add = () => Promise.resolve(null);
	const commit = () => Promise.resolve(null);
	const push = () => Promise.resolve(null);
	create.withArgs(repositoryPath).returns(Promise.resolve({ add, commit, push }));
	existsSync.withArgs(dataPath).returns(true);
	await deleteEntry.deleteEntry(type, { __id__: id });
	t.true(remove.called);
});

test.serial('deleteEntry should not call remove if the folder does not exist', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	create.withArgs(repositoryPath).returns(Promise.resolve([]));
	existsSync.withArgs(dataPath).returns(false);
	await deleteEntry.deleteEntry(type, { __id__: id });
	t.false(remove.called);
});

test('deleteEntry should throw error if repository is not found', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	create.withArgs(repositoryPath).returns(Promise.resolve([]));
	existsSync.withArgs(dataPath).returns(true);
	await t.throws(deleteEntry.deleteEntry(type, { __id__: id }));
});
