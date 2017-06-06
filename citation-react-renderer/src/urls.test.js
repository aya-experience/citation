import test from 'ava';
import getPaths from './urls';

test('should work with one page', t => {
	const pages = [{ slug: '1', children: [] }];
	const result = getPaths(pages);
	t.deepEqual(result, [{ url: '/1', pages }]);
});

test('should work with one page and a child', t => {
	const pages = [
		{
			slug: '1',
			children: [{ slug: '2', children: [] }]
		}
	];
	const result = getPaths(pages);
	t.deepEqual(result, [{ url: '/1', pages: [pages[0]] }, { url: '/1/2', pages: [pages[0], pages[0].children[0]] }]);
});

test('should work with an home and one page', t => {
	const pages = [
		{
			slug: '',
			children: [{ slug: '1', children: [] }]
		}
	];
	const result = getPaths(pages);
	t.deepEqual(result, [{ url: '', pages: [pages[0]] }, { url: '/1', pages: [pages[0], pages[0].children[0]] }]);
});
