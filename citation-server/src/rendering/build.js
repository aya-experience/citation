import path from 'path';
import fs from 'fs-promise';

import conf from '../conf';
import spawn from '../utils/spawn';

export default async function build() {
	const builderLinkedPath = path.join(
		__dirname,
		'..',
		'..',
		'node_modules',
		`citation-${conf.render.framework}-builder`
	);
	const builderPath = await fs.realpath(builderLinkedPath);
	const bulierSrcPath = path.join(builderPath, 'src');
	const componentsJsPath = path.join(bulierSrcPath, 'components.js');

	const imports = conf.components
		.map((components, i) =>
			path.join(conf.work.components, i.toString(), 'master')
		)
		.map(componentsPath => path.relative(bulierSrcPath, componentsPath))
		.map(
			(componentsPath, i) => `import components${i} from '${componentsPath}';`
		)
		.join('\n');
	const exports = conf.components
		.map((_, i) => `...components${i}`)
		.join(',\n	');

	const componentsJs = `${imports}

export default {
	${exports}
};`;

	await fs.writeFile(componentsJsPath, componentsJs);

	await spawn('yarn build', builderPath);

	return path.join(builderPath, 'build');
}
