import {Repository, Remote} from 'nodegit';
import fs from 'fs-promise';
import winston from 'winston';

const logger = winston.loggers.get('NodeGit');

export default async function check(directory, expectedRemoteUrl) {
	try {
		logger.debug(`Check for path ${directory} and url ${expectedRemoteUrl}`);

		await fs.access(directory, fs.constants.W_OK);
		const repository = await Repository.open(directory);
		const origin = await Remote.lookup(repository, 'origin');
		const originUrl = await origin.url();

		logger.debug(`Check ${originUrl} compared to ${expectedRemoteUrl}`);

		return originUrl === expectedRemoteUrl;
	} catch (error) {
		logger.error(`Check return false following error ${error}`);
		return false;
	}
}
