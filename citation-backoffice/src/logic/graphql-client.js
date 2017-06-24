/* global process */

let url;

if (process && process.env && process.env.NODE_ENV === 'development') {
	url = 'http://localhost:4000/graphql';
} else {
	url = '/graphql';
}

export const serverUrl = url;

export function query(query) {
	return fetch(serverUrl, {
		method: 'POST',
		body: `query Query ${query}`,
		headers: new Headers({ 'Content-Type': 'application/graphql' })
	}).then(response => response.json());
}

export function mutation(mutation) {
	return fetch(serverUrl, {
		method: 'POST',
		body: `mutation Query ${mutation}`,
		headers: new Headers({ 'Content-Type': 'application/graphql' })
	}).then(response => response.json());
}
