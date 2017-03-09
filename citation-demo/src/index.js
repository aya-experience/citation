/* global process */

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import CitationRouter from 'citation-react-router';
import components from './components';
import './index.css';

let serverUrl;

if (process && process.env && process.env.NODE_ENV === 'development') {
	serverUrl = 'http://localhost:4000/graphql';
} else {
	serverUrl = '/graphql';
}

ReactDOM.render(
	<BrowserRouter>
		<CitationRouter serverUrl={serverUrl} components={components}/>
	</BrowserRouter>,
	document.getElementById('root')
);
