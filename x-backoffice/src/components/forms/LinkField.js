import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field} from 'redux-form';

class LinksField extends Component {
	static propTypes = {
		input: PropTypes.object.isRequired,
		values: PropTypes.array.isRequired
	}

	parseLink(value) {
		return {__id__: value};
	}

	formatLink(value) {
		return value.__id__;
	}

	render() {
		return (
			<Field name={this.props.input.name} component="select" parse={this.parseLink} format={this.formatLink}>
				{this.props.values.map((value, i) => (
					<option key={i} value={value.__id__}>{value.__id__}</option>
				))}
			</Field>
		);
	}
}

export default LinksField;
