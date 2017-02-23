import os from 'os';
import {Reference, Signature} from 'nodegit';
import winston from 'winston';

const logger = winston.loggers.get('NodeGit');

export default async function commit(oid) {
	try {
		const head = await Reference.nameToId(this.repository, 'HEAD');
		const parent = await this.repository.getCommit(head);
		const hostname = os.hostname();
		const author = Signature.create('Citation', 'citation@aya-experience.com', new Date().getTime() / 1000 | 0, 0);
		const commitId = await this.repository.createCommit('HEAD', author, author, `Update from Citation server - From host : ${hostname}`, oid, [parent]);
		return commitId;
	} catch (error) {
		logger.error(`NodeGit commit error ${error}`);
		throw error;
	}
};
