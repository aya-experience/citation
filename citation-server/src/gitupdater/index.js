import path from 'path';

import _ from 'lodash';
import cron from 'node-cron';
import { mapSeries } from 'bluebird';
import winston from 'winston';

import conf from '../conf';
import render from '../rendering';
import { build, updateComponentsJs } from '../rendering/build';
import spawn from '../utils/spawn';
import { updater } from './updater';

const logger = winston.loggers.get('GitUpdater');

let task;

export async function updateContent() {
	const contentRepository = conf.content.repository;
	const contentDiretory = path.join(conf.work.content, conf.content.branch);
	return updater('Content', contentRepository, conf.content.branch, contentDiretory);
}

export async function updateComponent(components, i) {
	if (components.repository) {
		const directory = path.resolve(conf.work.components, i.toString());
		return updater(`Components(${i})`, components.repository, 'master', directory);
	}
	return false;
}

async function updaterTask(first = false) {
	logger.info('Updater task starting', first);

	const contentChange = await updateContent();

	if (conf.render.disable) {
		return;
	}

	const componentsChanges = await mapSeries(conf.components, updateComponent);

	await mapSeries(conf.components, async (components, i) => {
		if (componentsChanges[i]) {
			const masterPath = path.resolve(conf.work.components, i.toString());
			await spawn(components['install-command'], masterPath);
			await spawn(components['build-command'], masterPath);
		}
	});

	const componentsChange = _.compact(componentsChanges).length > 0;

	if (first) {
		await updateComponentsJs();
	}

	if (!conf.dev && conf.render.enable) {
		if (componentsChange || first) {
			await build();
		}

		if (contentChange || componentsChange || first) {
			await render();
		}
	}
}

export async function start() {
	logger.info(`Updater starting on ${conf.updater.cron}`);
	await updaterTask(true);
	task = cron.schedule(conf.updater.cron, updaterTask, true);
}

export function stop() {
	task.stop();
	logger.info(`Content updater stopped`);
}
