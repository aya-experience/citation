import { spawn as spawnProcess } from 'child_process';

export default function spawn(cmd, cwd) {
	return new Promise((resolve, reject) => {
		const process = spawnProcess(cmd, [], {
			stdio: 'inherit',
			shell: true,
			cwd
		});

		process.on('exit', code => {
			if (code === 0) {
				resolve();
			} else {
				reject();
			}
		});
	});
}
