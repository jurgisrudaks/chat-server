# Chat Server

[![Build Status](https://travis-ci.com/jurgisrudaks/chat-server.svg?branch=master)](https://travis-ci.com/jurgisrudaks/chat-server)

Simple NodeJS chat server built with Socket.io and Express

# Table of contents:

- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [ESLint](#eslint)
- [Dependencies](#dependencies)
  - [`dependencies`](#dependencies-1)
  - [`devDependencies`](#devdependencies)

# Pre-reqs

To build and run this app locally you will need the following:

- Install [Node.js](https://nodejs.org/en/)

# Getting started

- Clone the repository

```
git clone --depth=1 https://github.com/jurgisrudaks/chat-server.git <project_name>
```

- Install dependencies

```
cd <project_name>
npm install
```

- Build and run the project

```
npm run build
npm start
```

Or, if you're using VS Code, you can use `cmd + shift + b` to run the default build task (which is mapped to `npm run build`), and then you can use the command palette (`cmd + shift + p`) and select `Tasks: Run Task` > `npm: start` to run `npm start` for you.

# Project Structure

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name                        | Description                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **.vscode**                 | Contains VS Code specific settings                                                                         |
| **.github**                 | Contains GitHub settings and configurations, incuding the GitHub Actions workflows                         |
| **dist**                    | Contains the distributable (or output) from TypeScript build. This is the code to be shipped               |
| **node_modules**            | Contains all npm dependencies                                                                              |
| **src**                     | Contains source code that will be compiled to the dist dir                                                 |
| **src**/server.ts           | Entry point to app                                                                                         |
| **\*\*/\_\_tests\_\_/\*\*** | Separate folder next to the source being tested, contains tests.                                           |
| .env.example                | Example .env file, create .env file based on this example.                                                 |
| jest.config.js              | Used to configure Jest running tests written in TypeScript                                                 |
| package.json                | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped) |
| tsconfig.json               | Config settings for compiling server code written in TypeScript                                            |
| .eslintrc                   | Config settings for ESLint code style checking                                                             |
| .eslintignore               | Config settings for paths to exclude from linting                                                          |

## Running the build

| Npm Script   | Description                                                                               |
| ------------ | ----------------------------------------------------------------------------------------- |
| `start`      | Does the same as 'npm run serve'. Can be invoked with `npm start`                         |
| `build`      | Full build. Runs ALL build tasks (`build-ts`, `lint`)                                     |
| `serve`      | Runs node on `dist/server.js` which is the apps entry point                               |
| `watch-node` | Runs node with nodemon so the process restarts if it crashes. Used in the main watch task |
| `watch`      | Runs all watch tasks (TypeScript, Node).                                                  |
| `test`       | Runs tests using Jest test runner                                                         |
| `watch-test` | Runs tests in watch mode                                                                  |
| `build-ts`   | Compiles all source `.ts` files to `.js` files in the `dist` folder                       |
| `watch-ts`   | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed       |
| `lint`       | Runs ESLint on project files                                                              |
| `dev`        | Performs a full build and then serves the app in watch mode                               |
| `dev-serve`  | Runs the app with the --inspect flag                                                      |
| `dev-watch`  | The same as `watch` but includes the --inspect flag so you can attach a debugger          |

# Testing

This project, uses [Jest](https://facebook.github.io/jest/) as test framework.

## Running tests

Simply run `npm run test`.
Note this will also generate a coverage report.

# ESLint

ESLint is a code linter which mainly helps catch quickly minor code quality and style issues.

## Running ESLint

Like the rest of our build steps, we use npm scripts to invoke ESLint.
To run ESLint you can call the main build script or just the ESLint task.

```
npm run build   // runs full build including ESLint
npm run lint    // runs only ESLint
```

# Dependencies

Dependencies are managed through `package.json`.
In that file you'll find two sections:

## `dependencies`

| Package | Description                                 |
| ------- | ------------------------------------------- |
| dotenv  | Loads environment variables from .env file. |
| express | Node.js web framework.                      |
| winston | Logging library                             |

## `devDependencies`

| Package      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| @types       | Dependencies in this folder are `.d.ts` files used to provide types     |
| chai         | Testing utility library that makes it easier to write tests             |
| concurrently | Utility that manages multiple concurrent tasks. Used with npm scripts   |
| jest         | Testing library for JavaScript.                                         |
| nodemon      | Utility that automatically restarts node process when it crashes        |
| supertest    | HTTP assertion library.                                                 |
| ts-jest      | A preprocessor with sourcemap support to help use TypeScript with Jest. |
| eslint       | Linter for JavaScript and TypeScript files                              |
| typescript   | JavaScript compiler/type checker that boosts JavaScript productivity    |

To install or update these dependencies you can use `npm install` or `npm update`.
