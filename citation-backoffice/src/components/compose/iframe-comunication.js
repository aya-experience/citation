import { find } from 'lodash';

import { store } from '../../logic/store';
import { removeComponentSave, sortComponentSave } from '../../logic/compose';

const context = {
	iframe: null,
	messageListener: null,
	history: null
};

export const askReload = () => {
	if (context.iframe !== null) {
		context.iframe.contentWindow.postMessage({ type: 'RELOAD' }, '*');
	}
};

const iframeMessageDispatcher = event => {
	const component = find(store.getState().compose.components, {
		__id__: event.data.content.__id__
	});
	console.log('message from iframe', event.data, component);
	switch (event.data.type) {
		case 'EDIT':
			context.history.push(`/structure/compose/${context.pageId}/component/${component.__id__}`);
			break;
		case 'DELETE': {
			const parent = find(store.getState().compose.components, {
				__id__: event.data.parent.__id__
			});
			store.dispatch(removeComponentSave({ parent, component })).then(askReload);
			break;
		}
		case 'ADD_CHILD':
			context.history.push(
				`/structure/compose/${context.pageId}/component/parent/${component.__id__}`
			);
			break;
		case 'SORT_CHILDREN':
			store
				.dispatch(
					sortComponentSave({
						parent: component,
						oldIndex: event.data.oldIndex,
						newIndex: event.data.newIndex
					})
				)
				.then(askReload);
			break;
		default: // Nothing to do
	}
};

export const startIframeMessageListener = (pageId, history) => {
	console.log('start', pageId);
	context.pageId = pageId;
	context.history = history;
	context.iframe = document.querySelector('iframe[title=edition]');
	context.messageListener = event => {
		if (context.iframe && event.source === context.iframe.contentWindow) {
			iframeMessageDispatcher(event);
		}
	};
	window.addEventListener('message', context.messageListener);
};

export const stopIframeMessageListener = () => {
	if (context.messageListener !== null) {
		window.removeEventListener('message', context.messageListener);
		context.messageListener = null;
	}
};
