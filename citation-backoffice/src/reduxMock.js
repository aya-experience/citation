import sinon from 'sinon';

export const store = {
	subscribe: sinon.stub(),
	dispatch: sinon.stub(),
	getState: sinon.stub(),
	ownProps: sinon.stub()
};
