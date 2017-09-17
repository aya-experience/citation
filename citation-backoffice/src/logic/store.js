import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { reducer as model } from './model';
import { reducer as content } from './content';
import sitemap from './sitemap';
import composeReducer from './compose';

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;

const middlewares = compose(applyMiddleware(thunkMiddleware), devTools);

const reducers = combineReducers({
	model,
	content,
	sitemap,
	compose: composeReducer,
	form
});

export const store = createStore(reducers, middlewares);
