# Citation

## Name

- Pronounced like **site**-ation, not far from "website creation" which is the purpose of the solution
- French reference meaning quotation (exist in english but less used)

## Purpose

It is an Open Source experiment aiming to build a next generation Open Source CMS solution merging together many new approaches:

- Headless CMS
- API GraphQL *perhaps REST and Falcor too*
- Git repository as a content database
- *Content model configuration*
- *Clean, modern, mobile friendly* backoffice
- Static site generation
- JavaScript front end with server side rendering
- JavaScript framework agnostic
- Website pages configuration
- *Service Worker integration*

*Italic is for points not yet started*

## Similar solutions

There is a lot of similar solutions in the wild. One of the key differences of this project will be the Open Source, downloadable, "not only SaaS" kind. Yet if anyone find a really similar Open Source solution, please let me know, I could have missed it.

To trace all references, here is the list of considered solutions
- Contentful https://www.contentful.com/ (CMS, Saas, Headless)
- Prismic https://prismic.io/ (CMS, Saas, Headless)
- Keystone http://keystonejs.com/ (CMS, OSS, Node, Express, MongoDb)
- Next https://github.com/zeit/next.js (SSR, React, Babel, Webpack)
- Nuxt https://nuxtjs.org/ (SSR, Vue)
- Phenomic https://github.com/MoOx/phenomic (SSG, React, Babel, Webpack)
- Gatsby https://github.com/gatsbyjs/gatsby (SSG, React, Babel, Webpack)
- Ghost https://ghost.org/ (CMS, OSS & Saas, Node, Express, Ember, SQL)
- GraphCMS https://graphcms.com/ (CMS, Saas, GraphQL, Headless)
- ABE https://github.com/abecms/abecms (CMS, OSS, SSG)

## Packaging

The user has to start a JavaScript frontend project the way he likes but with one of these frameworks: React, *Vue*, *Angular*.

In his project, the user use the Citation router in his application to automatically benefit of the website configuration of Citation.

The user has to prepare a command (npm script or anything else) which compile his code in order that Citation is able to render statically the application.

Citation server is run as a script in the project with a small configuration file. It will offer the GraphQL content API, the admin app and a statically generated frontend based on the user project.

## Architecture

The project is organized in several sub projects.

- [citation-server](citation-server) is a Node/Hapi server containing the storage layer in a Git repository (called GitAsDb), the GraphQL API and integrating the backoffice and the renderers.
- [citation-backoffice](citation-backoffice) is a React application of the backoffice or admin of the CMS. It uses the GraphQL API to read and write the content.
- [citation-react-renderer](citation-react-renderer) is a Node script which is designed to load a React application based on a Citation router and render each pages.
- [citation-react-router](citation-react-router) is a React component based on React Router v4 designed to use a Citation server API to produce the routing corresponding to the content in Citation.
- [citation-demo](citation-demo) is the prototype of a website using Citation. This project use React as framework. You can clone this repo and use it as a seed project.

## Usage

This is a meta project, there is nothing directly here.

To install NPM dependencies of all projects, you can use Lerna :

```shell
npm install
npm run lerna:bootstrap
```

A meta command is available :

```shell
npm start
```

It will run Babel in watch mode on each submodule and run Citation server with nodemon from citation-demo.

You still have to start both React app (demo and backoffice) by yourself.
