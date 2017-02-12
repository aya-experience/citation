import {Remote} from 'nodegit';

import {securityOptions} from './wrapper';

export default async function push() {
	try {
		const remote = await Remote.lookup(this.repository, 'origin');
		await remote.push(['refs/heads/master:refs/heads/master'], securityOptions);
	} catch (error) {
		console.error('NodeGit push error', error);
		throw error;
	}
}
