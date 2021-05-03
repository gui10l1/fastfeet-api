# FastFeet API

![FastFeet Logo](https://gui10l1-github-projects.s3.amazonaws.com/fastfeet.png)

This API is part of a project called FastFeet. FastFeet is an application to
deal with delivering. This app is destinated to the delivery men to pick up
packages and bring it to the address solicited.

# Installation

## Packages

First you need to run `yarn` to install all dependencies from `package.json`.

## Database

FastFeet database uses **PostgreSQL** and all the management is done with
**Typeorm**. To configure database you need to:

1. Create a new `ormconfig.json` at the source of the project (use ormconfig.exemple.json to help you).
2. Define `host`, `port`, `username`, `password`, and the `database`.
3. Check if the connection works by running `yarn dev` in the console.
4. Run `yarn typeorm migration:run` in the console to create database tables.
5. Run `yarn dev` to initiate the development server.

For more information to deal with Typeorm read the [docs](https://typeorm.io/#/).

## Environment variables

FastFeet API needs all the environment variables, and you it's necessary to
initialize all of them before using the API.

* APP_SECRET

This variable is used in some funcionalities, and needs to have a value. The
value for it can be anything you want.

# API information

This API uses Node.js with Typescript and ESLint patterns from Airbnb.
