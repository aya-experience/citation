export default function getPaths(pages, parent = { url: '', pages: [] }) {
	return pages.reduce((acc, page) => {
		const children = page.children ? page.children : [];
		let url;
		if (parent.url === '' && (page.slug === '' || page.slug === '/')) {
			url = '';
		} else {
			url = `${parent.url}/${page.slug}`;
		}
		const result = { url, pages: [...parent.pages, page] };
		acc.push(result, ...getPaths(children, result));
		return acc;
	}, []);
}
