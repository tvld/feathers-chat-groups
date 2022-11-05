# feathers-chat

[![CI](https://github.com/feathersjs/feathers-chat/workflows/CI/badge.svg)](https://github.com/feathersjs/feathers-chat/actions?query=workflow%3ACI)

> A FeathersJS chat application

## About

This repository includes the TypeScript and JavaScript API server from the [official Feathers chat guide](https://dove.feathersjs.com/guides/basics/generator.html) as well as chat frontend examples for different frameworks.

## API server

### TypeScript

The TypeScript version of the chat API server can be found in the [typescript folder](./typescript/). To start it install the dependencies like this:

```
cd typescript
npm install
```

Then compile the source code and run the database migration which will initialize an SQLite datbase in the `feathers-chat.sqlite` file.

```
npm run compile
npm run migrate
```

It can now be started with:

```
npm start
```

Or in development mode with

```
npm run dev
```

### JavaScript

The JavaScript version of the chat API server can be found in the [javascript folder](./javascript/). To start it install the dependencies like this:

```
cd javascript
npm install
```

Then run the database migration which will initialize an SQLite datbase in the `feathers-chat.sqlite` file.

```
npm run migrate
```

It can now be started with:

```
npm start
```

Or in development mode with

```
npm run dev
```

## Frontend

### Plain JavaScript

A plain JavaScript frontend can be found in the [public](./public/) folder which is hosted statically by both, the TypeScript and JavaScript [api server](#api-server).

### React

The React chat frontend example in the [react](./react/) folder uses create-react-app, TypeScript and the typed client available in the [TypeScript API server](#typescript).

The TypeScript API server needs to be compiled and then running in order for this example to work.

### VueJS

TBD
