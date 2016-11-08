import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {reducer as collections} from './collections/collections';

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f;

const middlewares = compose(
	applyMiddleware(
		thunkMiddleware
	),
	devTools
);

const reducers = combineReducers({
	collections
});

export const store = createStore(
  reducers,
  middlewares
);
