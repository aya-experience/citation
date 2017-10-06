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
		ref[page._id_] = page;
	});

	pages.forEach(page => {
		if (Array.isArray(page.children)) {
			page.children = page.children.filter(page => page !== null).map(({ _id_ }) => {
				const child = ref[_id_];
				child._child_ = true;
				return child;
			});
		}
	});

	pages = pages.filter(page => !page._child_);
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
				_id_, slug, title,
				children {
					_id_
				},
				component {
					_id_, _tree_
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
			Component(id: "${component._id_}") {
				${component._tree_}
			}
		}`
	);
	return { _id_: component._id_, ...response.Component[0] };
}
