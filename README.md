# Citation

## Name

- Pronounced like **site**-ation, not far from "website creation" which is the purpose of the solution
- French reference meaning quotation (exist in english but less used)

## Purpose

It is an Open Source experiment aiming to build a next generation Open Source CMS solution merging together many new approaches:

- Headless CMS
- API GraphQL perhaps REST too
- Git repository as a content database
- Content model configuration
- Clean, modern, mobile friendly backoffice
- Static site generation
- JavaScript front end with server side rendering
- Website pages configuration

## Similar solutions

There is a lot of similar solutions in the wild. One of the key differences of this project will be the Open Source, downloadable, "not only SaaS" kind. Yet if anyone find a really similar Open Source solution, please let me know, I could have missed it.

To trace all references, here is the list of considered solutions
- Contentful https://www.contentful.com/ (CMS, Saas, Headless)
- Prismic https://prismic.io/ (CMS, Saas, Headless)
- Keystone http://keystonejs.com/ (CMS, OSS, Node, Express, MongoDb)
- Next https://github.com/zeit/next.js (SSR, React, Babel, Webpack)
- Nuxt https://nuxtjs.org/ (SSR, Vue)
- Phenomic https://github.com/MoOx/phenomic (SSG, React, Babel, Webpack)
- Ghost https://ghost.org/ (CMS, OSS & Saas, Node, Express, Ember, SQL)
- GraphCMS https://graphcms.com/ (CMS, Saas, GraphQL, Headless)
- ABE https://github.com/abecms/abecms (CMS, OSS, SSG)

## Packaging

At this point, the project is not organized as a packaged solution. It would be to dificult to reason about and to test each features If I had already to clearly split what is a generic packaged feature and what is specific of the site using the solution. At one point later, when the features exists and the limit will be clear, I'll do the work of packaging a reusable solution.

## Architecture

The project is organized in three sub projects.

- [citation-server](citation-server) is a Node/Hapi server containing the storage layer in a Git repository (called GitAsDb) and the GraphQL API.
- [citation-backoffice](citation-backoffice) is a React application of the Back Office. It uses the GraphQL API to read and write the content.
- [citation-frontoffice](citation-frontoffice) is a React application of the Front Office. The target is to package a lib to help build such an app and not a package app. Waiting for the packaging step of the project it's one project containing both what will be the lib, and what will be the specific part of the app.
