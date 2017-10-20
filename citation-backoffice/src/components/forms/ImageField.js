import Dropzone from 'react-dropzone';
import React, { PropTypes, Component } from 'react';

class ImageField extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired
	};

	handleDrop(files) {
		this.props.fields.push(files);
	}

	render() {
		console.log(this.props.fields);
		return (
			<Dropzone onDrop={this.handleDrop}>
				<p>Images</p>
			</Dropzone>
		);
	}
}

export default ImageField;
