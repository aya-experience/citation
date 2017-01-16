# Citation Frontoffice

This project is a bit complicated. Currently it's a React application presenting data through the GraphQL API of citation-server. But it aims to be a bigger and more structured project.

- It will contains the [pre-rendering](#pre-rendering) of the application
- It will contains a generic [routing](#routing) based on the citation-server data
- It will be split between the specific part of the application and the generic part provided by citation-cms
- The generic part will be declined not only for React but also for Angular 2 and Vue 2

## Tooling

At this point, the tooling is based on react-scripts using Babel, ESLint and Webpack.

## Libraries

Main library used in development is only React Router v4 for now.

## Routing

The router is most obvious element which will be in the generic part of the project. The goal is to have a asynchronous routing based on the data of citation-server.

## Default components

There will be at least a Default component which will be used to render any pages where the component is set to Default or an unknown or undefined one. In the long term, it could exist more than one generic component.

## Pre rendering

The pre-rendering process will be a generic one too. It will be a process which will be able to list all urls possible and launch the server side rendering for each one in order to generate a dist folder with all pages pre-rendered.

## Specfic code

This project will also contains a part of specific code of an example website which will be an alternative for http://aya-experience.com
