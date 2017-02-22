import {Cred} from 'nodegit';

import conf from '../conf';

export const securityOptions = {
	callbacks: {
		credentials(/* url, username */) {
			const username = conf.content.username;
			const password = process.env[conf.content['password-env-var']];
			return Cred.userpassPlaintextNew(username, password);
		},
		certificateCheck() {
			return 1;
		}
	}
};
