import path from 'path';
import _ from 'lodash';
import winston from 'winston';
import cron from 'node-cron';

import conf from '../conf';
import render from '../rendering';
import spawn from '../utils/spawn';
import {updater} from './updater';

const logger = winston.loggers.get('GitUpdater');

const tasks = [];

export async function updateCallback() {
	const componentsConf = _.get(conf, 'components[0]', {});
	const directory = path.resolve(conf.work.components, '0');
	const masterPath = path.resolve(directory, 'master');
	await spawn(componentsConf['install-command'], masterPath);
	await spawn(componentsConf['build-command'], masterPath);
	await render();
}

export async function start() {
	const componentsConf = _.get(conf, 'components[0]', {});
	const cronValue = componentsConf.cron;
	logger.info(`Components updater starting on ${cronValue}`);
	const repository = componentsConf.repository;
	const directory = path.resolve(conf.work.components, '0');
	const boundUpdater = updater.bind(
		undefined,
		'Components (0)',
		repository,
		directory,
		updateCallback
	);
	await boundUpdater();
	tasks[0] = cron.schedule(cronValue, boundUpdater, true);
}

export async function stop() {
	tasks[0].stop();
	logger.info(`Components updater stopped`);
}
