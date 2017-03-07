import {queries} from 'citation-react-router';

export default async function load(serverUrl, pages) {
	let result = {};
	for (const page of pages) {
		const children = page.children ? page.children : [];
		const childrenContent = await load(serverUrl, children);
		result = {...result, ...childrenContent};
		if (!result[page.component.id]) {
			result[page.component.id] = await queries.queryComponentTree(serverUrl, page.component);
		}
	}
	return result;
}
