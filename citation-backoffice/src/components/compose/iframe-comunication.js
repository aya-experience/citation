import { find } from 'lodash';

import { store } from '../../logic/store';
import { editComponent, removeComponent, addChildComponent, sortChildComponent } from '../../logic/compose';

const iframeMessageDispatcher = event => {
	const component = find(store.getState().compose.components, {
		__id__: event.data.content.__id__
	});
	console.log('message from iframe', event.data, component);
	switch (event.data.type) {
		case 'EDIT':
			store.dispatch(editComponent({ component, position: event.data.position }));
			break;
		case 'REMOVE':
			store.dispatch(removeComponent({ component }));
			break;
		case 'ADD_CHILD':
			store.dispatch(addChildComponent({ component }));
			break;
		case 'SORT_CHILDREN':
			store.dispatch(
				sortChildComponent({
					component,
					oldIndex: event.data.oldIndex,
					newIndex: event.data.newIndex
				})
			);
			break;
		default: // nothing to do
	}
};

const context = {
	iframe: null,
	messageListener: null
};

export const askReload = () => {
	if (context.iframe !== null) {
		context.iframe.contentWindow.postMessage({ type: 'RELOAD' }, '*');
	}
};

export const startIframeMessageListener = () => {
	context.iframe = document.querySelector('iframe[title=edition]');
	context.messageListener = event => {
		if (event.source === context.iframe.contentWindow) {
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
