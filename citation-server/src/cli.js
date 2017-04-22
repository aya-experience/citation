#!/usr/bin/env node

import path from 'path';
import meow from 'meow';
import citation from './index';

const cli = meow();

const filename = cli.flags.conf ? cli.flags.conf : 'citation.conf.json';
const filepath = path.join(process.cwd(), filename);
const conf = require(filepath); // eslint-disable-line import/no-dynamic-require

if (cli.flags.dev === true || process.env.NODE_ENV === 'development') {
	conf.dev = true;
}

citation(conf);
