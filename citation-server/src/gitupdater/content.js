import cron from 'node-cron';
import winston from 'winston';

import conf from '../conf';
import render from '../rendering';
import {updater} from './updater';

const logger = winston.loggers.get('GitUpdater');

let task;

export async function updateCallback() {
	await render();
}

export async function start() {
	logger.info(`Content updater starting on ${conf.content.cron}`);
	const repository = conf.content.repository;
	const content = conf.work.content;
	const boundUpdater = updater.bind(undefined, 'Content', repository, content, updateCallback);
	await boundUpdater();
	task = cron.schedule(conf.content.cron, boundUpdater, true);
}

export async function stop() {
	task.stop();
	logger.info(`Content updater stopped`);
}
