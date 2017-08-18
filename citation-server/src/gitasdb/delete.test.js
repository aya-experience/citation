import path from 'path';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const workingDirectory = 'content';

let existsSync;
let remove;
let create;

let deleteObject;

test.beforeEach(() => {
	existsSync = sinon.stub();
	remove = sinon.stub().returns(Promise.resolve([]));
	create = sinon.stub();
	deleteObject = proxyquire('./delete', {
		'./constants': { workingDirectory },
		'fs-extra': { existsSync, remove },
		'../nodegit/wrapper': { create },
		winston: { loggers: { get: () => ({ debug: () => {}, error: () => {} }) } }
	});
});

test('deleteObject should return the expected datas', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	const add = () => Promise.resolve(null);
	const commit = () => Promise.resolve(null);
	const push = () => Promise.resolve(null);
	create.withArgs(repositoryPath).returns(Promise.resolve({ add, commit, push }));
	existsSync.withArgs(dataPath).returns(true);
	t.deepEqual(await deleteObject.deleteObject(type, { __id__: id }), {
		__id__: id,
		message: `${type} ${id} was successfully deleted`
	});
});

test.serial('deleteObject should call remove if the folder exists', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	const add = () => Promise.resolve(null);
	const commit = () => Promise.resolve(null);
	const push = () => Promise.resolve(null);
	create.withArgs(repositoryPath).returns(Promise.resolve({ add, commit, push }));
	existsSync.withArgs(dataPath).returns(true);
	await deleteObject.deleteObject(type, { __id__: id });
	t.true(remove.called);
});

test.serial('deleteObject should not call remove if the folder does not exist', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	create.withArgs(repositoryPath).returns(Promise.resolve([]));
	existsSync.withArgs(dataPath).returns(false);
	await deleteObject.deleteObject(type, { __id__: id });
	t.false(remove.called);
});

test('deleteObject should throw error if repository is not found', async t => {
	const type = 'type';
	const id = 'id';
	const repositoryPath = path.resolve(workingDirectory, 'master');
	const dataPath = path.resolve(repositoryPath, type, id);
	create.withArgs(repositoryPath).returns(Promise.resolve([]));
	existsSync.withArgs(dataPath).returns(true);
	await t.throws(deleteObject.deleteObject(type, { __id__: id }));
});
