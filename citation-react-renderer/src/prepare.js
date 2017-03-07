import _ from 'lodash';

export default function prepareContents(url, contents) {
	const componentIds = _.map(url.pages, 'component.id');
	return _.pick(contents, componentIds);
}
