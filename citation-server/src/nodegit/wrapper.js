import {Cred, Repository} from 'nodegit';
import add from './add';
import commit from './commit';
import push from './push';
import pull from './pull';

export const securityOptions = {
	callbacks: {
		credentials(url, userName) {
			return Cred.sshKeyFromAgent(userName);
		},
		certificateCheck() {
			return 1;
		}
	}
};

export async function create(repositoryPath) {
	const repository = await Repository.open(repositoryPath);

	return {
		repository,
		add,
		commit,
		push,
		pull
	};
}
