import {exec as execSync} from 'child_process';
import conf from '../conf';

export function exec(cmd) {
	return new Promise((resolve, reject) => {
		execSync(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			}
			resolve({stdout, stderr});
		});
	});
}

export default async function prerender() {
	try {
		const {stdout} = await exec(conf.prerenderCmd);
		console.log(stdout);
	} catch (error) {
		console.error('Error during prerendering', error);
	}
}
