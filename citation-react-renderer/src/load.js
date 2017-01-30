import {queries} from 'citation-react-router';

export default async function load(serverUrl, pages, context = '') {
	let result = {};
	for (const page of pages) {
		const children = page.children ? page.children : [];
		const url = `${context}/${page.slug}`;
		result = {
			...result,
			[url]: await queries.queryComponentTree(serverUrl, page.component),
			...await load(serverUrl, children, url)
		};
	}
	return result;
}
