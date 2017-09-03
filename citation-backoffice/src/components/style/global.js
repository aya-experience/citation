/* eslint-disable no-unused-expressions */

import { injectGlobal } from 'styled-components';

injectGlobal`
	@import url('https://fonts.googleapis.com/css?family=Lato:300,400,700');

	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		font-family: Lato, sans-serif;
		font-size: 62.5%;
	}
`;
