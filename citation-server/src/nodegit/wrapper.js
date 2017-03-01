import {Repository} from 'nodegit';
import add from './add';
import remove from './remove';
import commit from './commit';
import push from './push';
import pull from './pull';

export async function create(repositoryPath) {
	const repository = await Repository.open(repositoryPath);

	return {
		repository,
		add,
		remove,
		commit,
		push,
		pull
	};
}
