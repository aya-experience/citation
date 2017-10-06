import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

const serverUrl = 'serverUrl';
const componentId1 = 'test1';
const componentId2 = 'test2';
const content1 = 'content1';
const content2 = 'content2';

let queryComponentTree;
let load;
let page1;
let page2;

test.beforeEach(() => {
	page1 = { component: { _id_: componentId1 } };
	page2 = { component: { _id_: componentId2 } };
	queryComponentTree = sinon.stub().returns(Promise.resolve([]));
	queryComponentTree.withArgs(serverUrl, page1.component).returns(content1);
	queryComponentTree.withArgs(serverUrl, page2.component).returns(content2);
	load = proxyquire('./load', {
		'citation-react-router': { queryComponentTree }
	}).default;
});

test('should work with a single page', async t => {
	const pages = [page1];
	const result = await load(serverUrl, pages);
	t.deepEqual(result, { [componentId1]: content1 });
});

test('should work with two pages', async t => {
	const pages = [page1, page2];
	const result = await load(serverUrl, pages);
	t.deepEqual(result, {
		[componentId1]: content1,
		[componentId2]: content2
	});
});

test('should work with a child page', async t => {
	page1.children = [page2];
	const pages = [page1];
	const result = await load(serverUrl, pages);
	t.deepEqual(result, {
		[componentId1]: content1,
		[componentId2]: content2
	});
});

test('should not load a component data twice', async t => {
	page2.component = page1.component;
	const pages = [page1, page2];
	const result = await load(serverUrl, pages);
	t.deepEqual(result, { [componentId1]: content1 });
	t.is(queryComponentTree.callCount, 1);
});
