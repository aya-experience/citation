import winston from 'winston';

import { securityOptions } from './security';

const logger = winston.loggers.get('NodeGit');

export default async function pull(branch) {
	try {
		const headCommit = await this.repository.getHeadCommit();
		await this.repository.fetchAll(securityOptions);
		const commitId = await this.repository.mergeBranches(branch, `origin/${branch}`);
		const pullResult = headCommit.id().toString() !== commitId.toString();
		logger.info(`With changes : ${pullResult}`);
		return pullResult;
	} catch (error) {
		logger.error(`NodeGit pull error ${error}`);
		throw error;
	}
}
