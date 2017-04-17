import path from 'path';

import fs from 'fs-promise';
import winston from 'winston';

import check from '../nodegit/check';
import clone from '../nodegit/clone';
import {create} from '../nodegit/wrapper';

const logger = winston.loggers.get('GitUpdater');

export async function updater(label, repositoryUrl, directory, updateCallback) {
	try {
		const masterPath = path.resolve(directory, 'master');
		const ready = await check(masterPath, repositoryUrl);

		if (!ready) {
			logger.info(`Repository ${repositoryUrl} not ready at ${masterPath}, cloning...`);
			await fs.remove(masterPath);
			await clone(repositoryUrl, masterPath);
			logger.info(`${repositoryUrl} clone done`);
		}

		const repository = await create(masterPath);
		const change = await repository.pull();

		if (change) {
			logger.info(`Pulled some changes for ${label}`);
			await updateCallback();
		} else {
			logger.debug(`No changes found for ${label}`);
		}
	} catch (error) {
		logger.error(`Something went wront when updating Git content ${error}`);
		throw error;
	}
}
