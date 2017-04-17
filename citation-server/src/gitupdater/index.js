import {start as contentStart, stop as contentStop} from './content';
import {start as componentsStart, stop as componentsStop} from './components';

export async function start() {
	return await Promise.all([
		contentStart(),
		componentsStart()
	]);
}

export async function stop() {
	return await Promise.all([
		contentStop(),
		componentsStop()
	]);
}
