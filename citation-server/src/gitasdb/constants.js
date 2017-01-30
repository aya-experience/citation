import path from 'path';
import conf from '../conf';

export const workingDirectory = path.resolve(process.cwd(), conf.content.directory);
