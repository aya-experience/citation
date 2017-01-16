import {
	Cred,
	Reference,
	Remote,
	Repository,
	Signature
} from 'nodegit';

export async function create(repositoryPath) {
	const repository = await Repository.open(repositoryPath);

	return {
		async add(path) {
			try {
				const index = await repository.refreshIndex();
				await index.addAll(path);
				await index.write();
				const oid = await index.writeTree();
				return oid;
			} catch (error) {
				console.error('Nodegit wrapper add error', error);
				throw error;
			}
		},

		async commit(oid) {
			try {
				const head = await Reference.nameToId(repository, 'HEAD');
				const parent = await repository.getCommit(head);
				const author = Signature.create('X-CMS', 'x-xms@aya-experience.com', new Date().getTime(), 0);
				const commitId = await repository.createCommit('HEAD', author, author, 'Update from X-CMS', oid, [parent]);
				return commitId;
			} catch (error) {
				console.error('Nodegit wrapper commit error', error);
				throw error;
			}
		},

		async push() {
			try {
				const remote = await Remote.lookup(repository, 'origin');
				await remote.push(['refs/heads/master:refs/heads/master'], {
					callbacks: {
						credentials(url, userName) {
							return Cred.sshKeyFromAgent(userName);
						},
						certificateCheck() {
							return 1;
						}
					}
				});
			} catch (error) {
				console.error('Nodegit wrapper push error', error);
				throw error;
			}
		}
	};
}
