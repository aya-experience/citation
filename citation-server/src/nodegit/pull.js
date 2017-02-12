import winston from 'winston';

import {securityOptions} from './wrapper';

const logger = winston.loggers.get('NodeGit');

export default async function pull() {
	try {
		const headCommit = await this.repository.getHeadCommit();
		await this.repository.fetchAll(securityOptions);
		const commitId = await this.repository.mergeBranches('master', 'origin/master');

		logger.debug(`Pull commit id ${commitId} compared to previous head ${headCommit.id()}`);

		return headCommit.id().toString() !== commitId.toString();
	} catch (error) {
		console.error('NodeGit pull error', error);
		throw error;
	}
}
