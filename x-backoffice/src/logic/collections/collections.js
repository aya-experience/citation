import {createAction, createReducer} from 'redux-act';
import {query} from '../graphql-client';

export const loadCollectionSuccess = createAction('load collection success');

export function loadCollection(type) {
	return dispatch => {
		return query(`{
			collection(type: "${type}")
		}`).then(response => dispatch(loadCollectionSuccess({type, data: response.data})));
	};
}

export const reducer = createReducer({
	[loadCollectionSuccess]: (state, payload) => ({
		...state,
		[payload.type]: payload.data
	})
}, {});

export const mapStateToProps = state => {
	return {
		collections: state.collections
	};
};

export const mapDispatchToProps = dispatch => {
	return {
		load: type => dispatch(loadCollection(type))
	};
};
