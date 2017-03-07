import test from 'ava';
import prepareContents from './prepare';

const componentId1 = 'componentId1';
const componentId2 = 'componentId2';
const page1 = {component: {id: componentId1}};
const page2 = {component: {id: componentId2}};
const content1 = 'content1';
const content2 = 'content2';
const contents = {
	[componentId1]: content1,
	[componentId2]: content2
};

test('should work with a single page', t => {
	const url = {url: '/test', pages: [page1]};
	const result = prepareContents(url, contents);
	t.deepEqual(result, {[componentId1]: content1});
});

test('should work with a single home page', t => {
	const url = {url: '', pages: [page1]};
	const result = prepareContents(url, contents);
	t.deepEqual(result, {[componentId1]: content1});
});

test('should work with an home page and a sub page', t => {
	const url = {url: '/test', pages: [page1, page2]};
	const result = prepareContents(url, contents);
	t.deepEqual(result, contents);
});
