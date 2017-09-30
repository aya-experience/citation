import { branch, renderNothing } from 'recompose';

const hideIf = test => branch(test, renderNothing);

export default hideIf;
