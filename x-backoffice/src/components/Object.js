import _ from 'lodash';
import React, {Component, PropTypes} from 'react';

import './Object.css';

export default class ObjectComponent extends Component {
	static propTypes = {
		params: PropTypes.object.isRequired
	}

	render() {
		return (
			<div>{this.props.params.slug}</div>
		);
	}
}
