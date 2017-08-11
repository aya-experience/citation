/* eslint-disable new-cap */

import { Clone } from 'nodegit';
import winston from 'winston';

import { securityOptions } from './security';

const logger = winston.loggers.get('NodeGit');

export default async function clone(repositoryUrl, repositoryPath, branch) {
	try {
		return await Clone(repositoryUrl, repositoryPath, {
			fetchOpts: securityOptions,
			checkoutBranch: branch
		});
	} catch (error) {
		logger.error(`Nodegit clone error ${error}`);
		throw error;
	}
}
