/* eslint "react/no-string-refs": "off" */

import React from 'react';

function defaultGetDimensions(element) {
	return [element.clientWidth, element.clientHeight];
}

function dimensions({ getDimensions = defaultGetDimensions } = {}) {
	return ComposedComponent => {
		return class DimensionsHOC extends React.Component {
			state = {};

			// Immediate updateDimensions callback with no debounce
			updateDimensionsImmediate = () => {
				const dimensions = getDimensions(this._parent);

				if (
					dimensions[0] !== this.state.containerWidth ||
					dimensions[1] !== this.state.containerHeight
				) {
					this.setState({
						containerWidth: dimensions[0],
						containerHeight: dimensions[1]
					});
				}
			};

			updateDimensions = this.updateDimensionsImmediate;

			onResize = () => {
				if (this.rqf) return;
				this.rqf = this.getWindow().requestAnimationFrame(() => {
					this.rqf = null;
					this.updateDimensions();
				});
			};

			// If the component is mounted in a different window to the javascript
			// context, as with https://github.com/JakeGinnivan/react-popout
			// then the `window` global will be different from the `window` that
			// contains the component.
			// Depends on `defaultView` which is not supported <IE9
			getWindow() {
				return this.refs.container
					? this.refs.container.ownerDocument.defaultView || window
					: window;
			}

			componentDidMount() {
				if (!this.refs.wrapper) {
					throw new Error('Cannot find wrapper div');
				}
				this._parent = this.refs.wrapper.parentNode;
				this.updateDimensionsImmediate();
				this.getWindow().addEventListener('resize', this.onResize, false);
			}

			componentWillUnmount() {
				this.getWindow().removeEventListener('resize', this.onResize);
			}

			/**
       * Returns the underlying wrapped component instance.
       * Useful if you need to access a method or property of the component
       * passed to react-dimensions.
       *
       * @return {object} The rendered React component
       * */
			getWrappedInstance() {
				return this.refs.wrappedInstance;
			}

			render() {
				const { containerWidth, containerHeight } = this.state;
				return (
					<div ref="wrapper">
						{(containerWidth || containerHeight) && (
								<ComposedComponent
									{...this.state}
									{...this.props}
									updateDimensions={this.updateDimensions}
								/>
							)}
					</div>
				);
			}
		};
	};
}

export default dimensions;
