export default {
	async graphqlQuery(url, body) {
		const response = await fetch(url, {
			method: 'POST',
			body,
			headers: new Headers({'Content-Type': 'application/graphql'})
		});
		const json = await response.json();
		return json.data;
	},

	buildPageTree(pages) {
		const ref = {};
		pages.forEach(page => {
			ref[page.__id__] = page;
		});

		pages.forEach(page => {
			if (Array.isArray(page.children)) {
				page.children = page.children.map(({__id__}) => {
					const child = ref[__id__];
					child.__child__ = true;
					return child;
				});
			}
		});

		return pages.filter(page => !page.__child__);
	},

	async queryPages(url) {
		const response = await this.graphqlQuery(url, `query Query {
			Page {
				__id__, slug, title,
				children {
					__id__
				},
				component {
					__id__, __tree__
				}
			}
		}`);
		return this.buildPageTree(response.Page);
	},

	async queryComponentTree(url, tree) {
		const response = await this.graphqlQuery(url, `query Query {
			Component(id: "${tree.__id__}") {
				${tree.__tree__}
			}
		}`);
		return response.Component[0];
	}
};
