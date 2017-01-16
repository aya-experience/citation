export default function getPaths(pages, context = '') {
	return pages.reduce((acc, page) => {
		const children = page.children ? page.children : [];
		const url = `${context}/${page.slug}`;
		acc.push(url, ...getPaths(children, url));
		return acc;
	}, []);
}
