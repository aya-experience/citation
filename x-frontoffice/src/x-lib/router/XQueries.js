export default {
	graphqlQuery(url, body) {
		return fetch(url, {
			method: 'POST',
			body,
			headers: new Headers({'Content-Type': 'application/graphql'})
		}).then(response => response.json())
			.then(response => response.data);
	},

	queryPages(url) {
		return this.graphqlQuery(url, `query Query {
			Page {
				__id__, slug
				children {
					__id__
				},
				component {
					__id__, __tree__
				}
			}
		}`);
	},

	queryComponentTree(url, tree) {
		return this.graphqlQuery(url, `query Query {
			Component(id: "${tree.__id__}") {
				${tree.__tree__}
			}
		}`);
	}
};
