import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import ObjectForm from './ObjectForm';

import './Object.css';

export default class ObjectComponent extends Component {
	static propTypes = {
		params: PropTypes.object.isRequired
	}

	handleSubmit(values, dispatch) {
		console.log('coucou', values, dispatch);
	}

	render() {
		return (
			<div className="Object">
				<h1>{this.props.params.slug}</h1>
				<ObjectForm onSubmit={this.handleSubmit}/>
			</div>
		);
	}
}
