import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router';

import XRouter from './x-lib/router/XRouter';
import components from './components';
import './index.css';

ReactDOM.render(
	<BrowserRouter>
		<XRouter serverUrl="http://localhost:4000/graphql" components={components}/>
	</BrowserRouter>,
	document.getElementById('root')
);
