import path from 'path';

import fs from 'fs-promise';
import winston from 'winston';
import cron from 'node-cron';

import conf from '../conf';
import check from '../nodegit/check';
import clone from '../nodegit/clone';
import {create} from '../nodegit/wrapper';
import render from '../rendering';
import {workingDirectory} from './constants';

const logger = winston.loggers.get('GitAsDb');

let task;

export async function start() {
	await update();
	task = cron.schedule('*/5 * * * *', update, true);
}

export async function stop() {
	task.stop();
}

export async function update() {
	try {
		logger.info('Starting...');

		const masterPath = path.resolve(workingDirectory, 'master');
		const ready = await check(masterPath, conf.content.repository);

		if (!ready) {
			logger.info(`Repository ${conf.content.repository} not ready at ${masterPath}, cloning...`);
			await fs.remove(masterPath);
			await clone(conf.content.repository, masterPath);
			logger.info(`${conf.content.repository} clone done`);
		}

		const repository = await create(masterPath);
		const change = await repository.pull();

		if (change) {
			logger.info(`Pulled some changes, trigger a rendering...`);
			await render();
		}

		logger.info('End');
	} catch (error) {
		logger.error(`Something went wront when updating Git content ${error}`);
		throw error;
	}
}
