import winston from 'winston';

const logger = winston.loggers.get('NodeGit');

export default async function remove(path) {
	try {
		const index = await this.repository.refreshIndex();
		await index.removeAll(path);
		await index.write();
		const oid = await index.writeTree();
		return oid;
	} catch (error) {
		logger.error(`NodeGit add error ${error}`);
		throw error;
	}
}
