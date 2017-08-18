import path from 'path';
import fs from 'fs-extra';
import { mapSeries } from 'bluebird';

import conf from '../conf';
import spawn from '../utils/spawn';

const citationServerPath = path.join(__dirname, '..', '..');

export async function getBuilderPath() {
	const builderLinkedPath = path.join(citationServerPath, conf.builder.directory);
	return await fs.realpath(builderLinkedPath);
}

export async function getComponentsPaths() {
	return mapSeries(conf.components, async (components, i) => {
		if (components.repository) {
			return path.join(conf.work.components, i.toString());
		}
		if (components.dependency) {
			const dependencyLinkedPath = path.join(conf.work.root, '../node_modules', components.dependency);
			return await fs.realpath(dependencyLinkedPath);
		}
		return components.directory;
	});
}

async function createComponentsJs() {
	const builderNodeModulesPath = path.join(await getBuilderPath(), 'node_modules');
	const componentsPaths = await getComponentsPaths();

	await mapSeries(componentsPaths, async (componentsPath, i) => {
		const moduleName = conf.components[i].dependency ? conf.components[i].dependency : `citation-components-${i}`;
		const destination = path.join(builderNodeModulesPath, moduleName);
		await fs.ensureSymlink(componentsPath, destination);
	});

	const imports = conf.components
		.map((components, i) => {
			if (components.dependency) {
				if (components.default) {
					return `import ${components.default} from '${components.dependency}';`;
				}
				return `import components${i} from '${components.dependency}';`;
			}
			return `import components${i} from 'citation-components-${i}';`;
		})
		.join('\n');

	const exports = conf.components
		.map((_, i) => {
			if (conf.components[i].default) {
				return conf.components[i].default;
			}
			return `...components${i}`;
		})
		.join(',\n	');

	return `${imports}

export default {
	${exports}
};`;
}

export async function updateComponentsJs() {
	const componentsJsPath = path.join(
		await getBuilderPath(),
		conf.builder['src-directory'],
		conf.builder['components-file']
	);

	const componentsJs = await createComponentsJs();

	await fs.writeFile(componentsJsPath, componentsJs);
}

export async function build() {
	const builderPath = await getBuilderPath();

	await spawn('yarn build', builderPath);
}

export async function start() {
	const builderPath = await getBuilderPath();

	await spawn('yarn start', builderPath);
}
