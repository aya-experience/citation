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

test('readType should map readEntry on each folder of a type', async t => {
	const type = 'type';
	const typePath = path.resolve(workingDirectory, branch, type);
	const folders = ['one', 'two', 'three'];
	const expected = folders.map(folder => ({ _id_: folder, _type_: type }));

	readdir.withArgs(typePath).returns(Promise.resolve(folders));
	t.deepEqual(await read.readType(type), expected);
});
