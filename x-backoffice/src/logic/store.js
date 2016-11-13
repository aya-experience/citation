import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {reducer as form} from 'redux-form';
import {reducer as collections} from './collections/collections';

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;

const middlewares = compose(
	applyMiddleware(
		thunkMiddleware
	),
	devTools
);

const reducers = combineReducers({
	collections,
	form
});

export const store = createStore(
  reducers,
  middlewares
);
