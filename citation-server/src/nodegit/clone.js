import {Cred, Clone} from 'nodegit';

// import {securityOptions} from './wrapper';

export default async function clone(repositoryUrl, repositoryPath) {
	try {
		return await Clone(repositoryUrl, repositoryPath, { // eslint-disable-line new-cap
			fetchOpts: {
				callbacks: {
					credentials(url, userName) {
						return Cred.sshKeyFromAgent(userName);
					},
					certificateCheck() {
						return 1;
					}
				}
			}
		});
	} catch (error) {
		console.error('Nodegit clone error', error);
		throw error;
	}
};
