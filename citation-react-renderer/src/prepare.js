export default function prepareContents(url, contents) {
	const result = {};
	url
		.split('/')
		.splice(1)
		.reduce((acc, pattern) => {
			let prevPath;
			let path;
			if (acc.length === 0) {
				prevPath = '/';
				path = '/' + pattern;
			} else {
				const prevDesc = acc[acc.length - 1];
				prevPath = prevDesc.path;
				path = prevPath + '/' + pattern;
			}
			acc.push({prevPath, path});
			return acc;
		}, [])
		.forEach(desc => {
			result[desc.prevPath] = contents[desc.path];
		});
	return result;
}
