import path from 'path';
import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const workingDirectory = 'workingDirectory';
const branch = 'branch';

let read;
let readdir;

test.beforeEach(() => {
	readdir = sinon.stub().returns(Promise.resolve([]));
	read = proxyquire('./read', {
		'../conf': {
			default: {
				content: { branch },
				work: { content: workingDirectory }
			}
		},
		'fs-extra': { readdir },
		winston: { loggers: { get: () => ({ debug: () => {} }) } }
	});
});

test('readCollection should map readObject on each folder of a type', async t => {
	const type = 'type';
	const collectionPath = path.resolve(workingDirectory, branch, type);
	const folders = ['one', 'two', 'three'];
	const expected = folders.map(folder => ({ __id__: folder, __type__: type }));

	readdir.withArgs(collectionPath).returns(Promise.resolve(folders));
	t.deepEqual(await read.readCollection(type), expected);
});
