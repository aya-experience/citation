import { Remote } from 'nodegit';
import winston from 'winston';

import { securityOptions } from './security';

const logger = winston.loggers.get('NodeGit');

export default async function push(branch) {
	try {
		const remote = await Remote.lookup(this.repository, 'origin');
		await remote.push([`refs/heads/${branch}:refs/heads/${branch}`], securityOptions, {
			callbacks: {
				credentials() {
					logger.info(`Push successfully`);
				}
			}
		});
	} catch (error) {
		logger.error(`NodeGit push error ${error}`);
		throw error;
	}
}
