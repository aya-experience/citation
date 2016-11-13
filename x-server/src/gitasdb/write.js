import path from 'path';
import fs from 'mz/fs';

import {workingDirectory} from './constants';
import {create} from '../nodegit/wrapper';
import {readObject} from './read';

export async function writeObject(type, slug, data) {
	try {
		// FS write
		const repositoryPath = path.resolve(workingDirectory, 'master');
		const objectPath = path.resolve(repositoryPath, type, slug);
		const objectFields = Object.keys(data);
		await Promise.all(objectFields.map(async field => {
			const fieldPath = path.resolve(objectPath, `${field}.md`);
			await fs.writeFile(fieldPath, data[field]);
		}));

		// Git Push
		const repository = await create(repositoryPath);
		const oid = await repository.add(objectFields.map(field => path.join(type, slug, `${field}.md`)));
		await repository.commit(oid);
		await repository.push();

		// Return read object
		return await readObject(type, slug);
	} catch (error) {
		console.error('Gitasdb write error', error);
		throw error;
	}
}
