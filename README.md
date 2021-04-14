# `budget-api`
Simple API for my [Home Budget](https://github.com/al4str/budget-client) client application

> DISCLAIMER: I am a modest Frontend Engineer and here lies my naive attempt to create an API application. Please, do not judge my professional skills by reviewing code of this repo. `budget-api` will always be a poorly duck-taped product of a few coding nights, which whole purpose is to serve my family needs

## Description
Source code is written in `webpack`-friendly ESM modules which handles path aliases and helps not to think about differences between `NodeJS` ESM modules and what I used to work with during frontend development.
Added basic `jsdoc` annotations to every exported entity to abuse `WebStorm` + `TypeScript` support and use the treasures of autocompletion and live type checking.
Throughout whole application used return contract for most methods:
```ts
{
  ok: Boolean
  reason: Error
  data: any
}
```
It makes modules interaction more predictable but with less effort. When error is thrown anywhere deep in a callstack - contract helps to check, handle and return user-friendly reason back to the client application without raising real javascript `Error`.
To keep it simple [node-json-db](https://github.com/Belphemur/node-json-db) was chosen to store data.
Replaced `ExpressJS` with [tinyhttp](https://github.com/talentlessguy/tinyhttp) to properly handle async middlewares.
For local development used `nodemon` to handle file system watching, webpack compilation and server execution.
Deployment happens on `DigitalOcean` droplet.
To minimize environment side effects during building and running application used `Docker` containerization. Finally `nginx` handles all client requests to `/api/` and proxies them to running docker container.

## Local development
```shell
# copy env file
cp depoly/.env.example .env

# install dependencies
npm install

# run nodemon, webpack, api server
npm run dev
```
