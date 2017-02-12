import {Reference, Signature} from 'nodegit';

export default async function commit(oid) {
	try {
		const head = await Reference.nameToId(this.repository, 'HEAD');
		const parent = await this.repository.getCommit(head);
		const author = Signature.create('Citation', 'citation@aya-experience.com', new Date().getTime(), 0);
		const commitId = await this.repository.createCommit('HEAD', author, author, 'Update from Citation server', oid, [parent]);
		return commitId;
	} catch (error) {
		console.error('NodeGit commit error', error);
		throw error;
	}
};
