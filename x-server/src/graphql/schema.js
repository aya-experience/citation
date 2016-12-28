/* eslint no-use-before-define: 0 */

import {GraphQLSchema} from 'graphql';
import query from './query';
import mutation from './mutation';

export const ContentSchema = new GraphQLSchema({query, mutation});
