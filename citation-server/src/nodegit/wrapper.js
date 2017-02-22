import {Repository} from 'nodegit';
import add from './add';
import commit from './commit';
import push from './push';
import pull from './pull';

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
