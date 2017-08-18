import path from 'path';

import fs from 'fs-extra';
import winston from 'winston';

import check from '../nodegit/check';
import clone from '../nodegit/clone';
import { create } from '../nodegit/wrapper';

const logger = winston.loggers.get('GitUpdater');

export async function updater(label, repositoryUrl, branch, directory) {
	try {
		const masterPath = path.resolve(directory);
		const ready = await check(masterPath, repositoryUrl);

		let change = false;

		if (ready) {
			const repository = await create(masterPath);
			change = await repository.pull(branch);
		} else {
			logger.info(`Repository ${repositoryUrl} not ready at ${masterPath}, cloning...`);
			await fs.remove(masterPath);
			await clone(repositoryUrl, masterPath, branch);
			logger.info(`${repositoryUrl} clone done`);
			change = true;
		}

		if (change) {
			logger.info(`Pulled some changes for ${label}`);
		} else {
			logger.debug(`No changes found for ${label}`);
		}

		return change;
	} catch (error) {
		logger.error(`Something went wront when updating Git content ${error}`);
		throw error;
	}
}
