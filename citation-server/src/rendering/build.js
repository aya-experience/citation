import path from 'path';
import fs from 'fs-promise';

import conf from '../conf';
import {spawn} from './';

export default async function build() {
	const imports = conf.components
		.map((components, i) => path.join(conf.work.components, i.toString(), 'master'))
		.map((path, i) => `import components${i} from '${path}';`)
		.join('\n');
	const exports = conf.components
		.map((_, i) => `...components${i}`)
		.join(',\n	');

	const componentsJs = `/* eslint-disable */

${imports}

export default {
	${exports}
};`;

	const builderPath = path.join(__dirname, '..', '..', 'node_modules', `citation-${conf.render.framework}-builder`);
	const componentsJsPath = path.join(builderPath, 'src', 'components.js');

	await fs.writeFile(componentsJsPath, componentsJs);

	await spawn('yarn build', builderPath);

	return path.join(builderPath, 'build');
}
