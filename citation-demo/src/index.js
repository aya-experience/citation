import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import CitationRouter from 'citation-react-router';
import components from './components';
import './index.css';

ReactDOM.render(
	<BrowserRouter>
		<CitationRouter serverUrl="http://localhost:4000/graphql" components={components}/>
	</BrowserRouter>,
	document.getElementById('root')
);
