# Citation Server

An Hapi server publishing a GraphQL API reading and storing data in a Git repository.

## Tooling

Code is transpiled with Babel (`src -> lib`). Eslint with XO configuration for linting. Nodemon is configured as an NPM script for autoreload dev mode.

## GraphQL

The API is implemented with GraphQL. The Schema definition is a work in progress. It should even be dynamic (if possible) in the end. It uses the official GraphQL implementation with the comunity hapi-graphql bridge

## GitAsDb

Not having found anyone implemented this idea correctly on GitHub. It's home made using nodegit.
- Read are performed asynchronously on file system
- Write trigger a commit and a push
- A recurring pull is planned to update data

A lot of question about perfs, concurency and conflicts are still opened and will be addressed during the progress of the implementation.
