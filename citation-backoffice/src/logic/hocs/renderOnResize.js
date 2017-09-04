import { lifecycle } from 'recompose';

const renderOnResize = lifecycle({
	componentDidMount() {
		this.listener = () => this.forceUpdate();
		window.addEventListener('resize', this.listener);
	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.listener);
	}
});

export default renderOnResize;
