# Citation

![Build Status](https://img.shields.io/travis/aya-experience/citation/master.svg)
![Codecov](https://img.shields.io/codecov/c/github/aya-experience/citation.svg)
![NPM Version](https://img.shields.io/npm/v/citation-server.svg)
![NPM Downloads](https://img.shields.io/npm/dm/citation-server.svg)

## Name

- Pronounced like **site**-ation, not far from "website creation" which is the purpose of the solution
- French reference meaning quotation (exist in english but less used)

## Purpose

Citation is a new way of building websites. It brings users the ability to fully configure a website by specifying the routing and organizing all the components of each page.

It's able to manage your website structure as well as all your contents through an easy to use administration interface which store every data in a Git repository. It gives you full control on your data: historic, branches, merges...

Developers will still be able to have a full control on the project. It's possible to use several frameworks, its own components and use the Web tooling of Citation or once again, use its own.

Citation can operate from a fully packaged and configurable solution to a set of development tools helping developers to create their very specific website.

## Start a new website

New project bootstraping is yet still too much manual and we are in the process of simplifying it.

The principal steps will be the following:
- Install `citation-server` with Yarn or NPM.
- Create a Git repository for your content data
- Choose your JavaScript framwork: React, *Angular*, *Vue*
- Choose existings components library or create your own
- Initialize a configuration file
- Start the server by running `citation-server`

## Project

The main goal of this project is to develop a solution to easily build websites with the best modern technologies.

It has to be and remain fully Open Source, downloadable, not "only SaaS".

It has to be usable by "not developers" users as well as "developers".

## Technologic approaches

To make these promises possible, Citation merge many new approaches and technologies:

- Headless CMS
- GraphQL API *perhaps REST and Falcor too*
- Git repository as a content database
- *Content model configuration*
- *Clean, modern, mobile friendly* backoffice
- Static site generation
- JavaScript front end with server side rendering
- JavaScript framework agnostic *Even if only the React connector is implemented yet*
- Website pages configuration
- *Service Worker integration*

*Italic is for points not yet started*

## Similar solutions

There is a lot of similar solutions in the wild. As far as I now, not one is bringing all the same package of feature that we are but I could have missed one.

Here is a list of the major references I considered. If you don't see an interesting one, please, let me know.

- Contentful https://www.contentful.com/ (CMS, Saas, Headless)
- Prismic https://prismic.io/ (CMS, Saas, Headless)
- Keystone http://keystonejs.com/ (CMS, OSS, Node, Express, MongoDb)
- Next https://github.com/zeit/next.js (SSR, React, Babel, Webpack)
- Nuxt https://nuxtjs.org/ (SSR, Vue)
- Phenomic https://github.com/MoOx/phenomic (SSG, React, Babel, Webpack)
- Gatsby https://github.com/gatsbyjs/gatsby (SSG, React, Babel, Webpack)
- Ghost https://ghost.org/ (CMS, OSS & Saas, Node, Express, Ember, SQL)
- GraphCMS https://graphcms.com/ (CMS, Saas, GraphQL, Headless)

(SSR for Server Side Rendering, SSG for Static Site Generation)

## Modules

The project is organized in several sub projects.

- [citation-server](citation-server) is a Node/Hapi server containing the storage layer in a Git repository (called GitAsDb), the GraphQL API and integrating the backoffice and the renderers.
- [citation-backoffice](citation-backoffice) is a React application of the backoffice or admin of the CMS. It uses the GraphQL API to read and write the content.
- [citation-react-demo](citation-react-demo) is the prototype of a website using Citation and React. It's the main entry point for our developments.
- [citation-react-renderer](citation-react-renderer) is a Node script which is designed to load a React application based on a Citation router and render each pages.
- [citation-react-router](citation-react-router) is a React component based on React Router v4 designed to use a Citation server API to produce the routing corresponding to the content in Citation.
- [citation-react-builder](citation-react-builder) is an empty create-react-app project with a bootstrap using citation-router that the server will use to build the website


## Usage

### From sources

This is a meta project, there is nothing directly here.

We use (and recommand) using Yarn yet, all commands should work with their NPM equivalent.

```shell
yarn
yarn bootstrap
```

There is a bunch of commands that you can run from each modules of the project or directly from here to run it on each module:

Linting with ESLint

```shell
yarn lint
```

Build with Babel for backend module and Webpack for frontend ones

```shell
yarn build
```

Test with AVA or Jest

```shell
yarn test
```

Development mode

```shell
yarn dev
```

It will run Babel in watch mode on backend projects, launch a dev server on frontend projects.

Launched here, it will run Babel in watch mode on each backend module and run Citation server with nodemon from the citation-react-demo folder.

### Using Docker

To start the demo inside of a Docker container, let's first build the image:

```
docker build -t citation .
```

You can also pull the image on the Docker Hub with:

```
docker pull ayaxp/citation
```

And start the container using the matching port on 4000:

```
docker run -p 4000:4000 citation
```

## Ownership disclaimer

The project is started inside a "IT services company", no lies about that. Our goals with this project are not hidden (sorted by eventual popularity groth):

- Internal R&D
- Internal Usage
- Internal usage for clients
- External communication
- Commercial support (no commercial version)
- Conquest of the world
