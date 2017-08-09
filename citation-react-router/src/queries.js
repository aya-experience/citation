export async function graphqlQuery(url, body) {
	const response = await fetch(url, {
		method: 'POST',
		body,
		headers: new Headers({ 'Content-Type': 'application/graphql' })
	});
	const json = await response.json();
	if (Array.isArray(json.errors)) {
		console.error('GraphQL query error', url, body, json);
		throw new Error('GraphQL query error');
	}
	return json.data;
}

export function buildPageTree(pages) {
	const ref = {};
	pages.forEach(page => {
		ref[page.__id__] = page;
	});

	pages.forEach(page => {
		if (Array.isArray(page.children)) {
			page.children = page.children.filter(page => page !== null).map(({ __id__ }) => {
				const child = ref[__id__];
				child.__child__ = true;
				return child;
			});
		}
	});

	pages = pages.filter(page => !page.__child__);
	sanitizeTree(pages);

	return pages;
}

function sanitizeTree(pages, stack = []) {
	pages.forEach(page => {
		if (Array.isArray(page.children)) {
			page.children = page.children.filter(page => !stack.includes(page));
			sanitizeTree(page.children, [...stack, page]);
		}
	});
}

export async function queryPages(url) {
	const response = await graphqlQuery(
		url,
		`query Query {
			Page {
				__id__, slug, title,
				children {
					__id__
				},
				component {
					__id__, __tree__
				}
			}
		}`
	);
	return response.Page;
}

export async function queryComponentTree(url, component) {
	const response = await graphqlQuery(
		url,
		`query Query {
			Component(id: "${component.__id__}") {
				${component.__tree__}
			}
		}`
	);
	return { __id__: component.__id__, ...response.Component[0] };
}
