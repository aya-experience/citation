/* eslint-env node */

import path from 'path';
import meow from 'meow';
import prerender from '.';

const cli = meow();

if (!cli.flags.serverUrl) {
	throw new Error('serverUrl is mandatory');
}

if (!cli.flags.components) {
	throw new Error('components path is mandatory');
}
cli.flags.components = require(path.join(__dirname, '../../..', cli.flags.components)); // eslint-disable-line import/no-dynamic-require
if (cli.flags.components.default) { // Handle ES2015 exports
	cli.flags.components = cli.flags.components.default;
}

if (!cli.flags.buildDir) {
	cli.flags.buildDir = process.cwd() + '/build';
}

if (!cli.flags.renderDir) {
	cli.flags.renderDir = process.cwd() + '/prerender';
}

if (!cli.flags.renderDir) {
	cli.flags.renderDir = process.cwd() + '/prerender';
}

if (!cli.flags.selector) {
	cli.flags.selector = '<div id="root"></div>';
}

prerender({...cli.flags});
