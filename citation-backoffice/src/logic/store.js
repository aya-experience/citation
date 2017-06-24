import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { reducer as collections } from './collections';
import { schemaReducer as schema, fieldsReducer as fields } from './schema';
import { reducer as objects } from './objects';
import { reducer as sitemap } from './sitemap';

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;

const middlewares = compose(applyMiddleware(thunkMiddleware), devTools);

const reducers = combineReducers({
	fields,
	schema,
	collections,
	objects,
	sitemap,
	form
});

export const store = createStore(reducers, middlewares);
