import _ from 'lodash';

export default function prepareContents(url, contents) {
	const componentIds = _.map(url.pages, 'component._id_');
	return _.pick(contents, componentIds);
}
