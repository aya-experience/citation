import test from 'ava';
import getPaths from './urls';

test('getPaths should work with one page', t => {
	const pages = [{slug: '1', children: []}];
	const result = getPaths(pages);
	t.deepEqual(result, ['/1']);
});

test('getPaths should work with one page and a children', t => {
	const pages = [
		{slug: '1', children: [
			{slug: '2', children: []}
		]}
	];
	const result = getPaths(pages);
	t.deepEqual(result, ['/1', '/1/2']);
});
