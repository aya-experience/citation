import { queryComponentTree } from 'citation-react-router';

export default async function load(serverUrl, pages) {
	let result = {};
	for (const page of pages) {
		const children = page.children ? page.children : [];
		const childrenContent = await load(serverUrl, children);
		result = { ...result, ...childrenContent };
		if (!result[page.component.__id__]) {
			result[page.component.__id__] = await queryComponentTree(serverUrl, page.component);
		}
	}
	return result;
}
