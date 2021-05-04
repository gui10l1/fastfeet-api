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

This API uses **Node.js** with **Typescript** and **ESLint** patterns from
Airbnb.

## Requesting

All requests need to be done in JSON or multi-part/formdata.

## Testing

FastFeet API uses TDD architecture to do unitary tests. To run tests by yourself
just run `yarn test` in the console. After this, a new folder called coverage
will appear at the project source, and inside it will have the lcov reports for
all the tests.

# Modules

This session is to explain how to deal with each API's module (users).

## Users

How to create, update, find, list, and delete users.

### Creating a new user (POST)

Endpoint: `/users`.

To create a new user you need to provide the data below in the request body
(JSON).

Request property | Description | Required
---------------- | ----------- | --------
`name` | Define user's name | :heavy_check_mark:
`cpf` | Define teh user's CPF, it will be for authentication | :heavy_check_mark:
`email` | Define user's email, it will be used for recovering password | :heavy_check_mark:
`password` | Define user's password, it will be used for authentication | :heavy_check_mark:
`deliveyMan` | Define if a user is a delivery man or not. It doesn't need to be provided if you are creating a delivery man user, but it's required when creating a admin user | :x:

There are some information you should know:

1. The first admin user needs to be created directly in the database;
2. To create a new admin user you need to provide your authentication `token` at the request headers (Bearer token), so the API can check if you have permissions to do such action;
3. To create a admin user you need to provide a property called `deliveryMan` (boolean) and give it a false value;
4. To create a delivey man you don't need to be authenticated, just provide your data and send the request.

## Finding a specific user (GET)

Endpoint: `/users/:id`.

To find a specific user you just need to provide the user id at the request
params.

Request property | Description | Required
---------------- | ----------- | --------
`id` | Parameter to find one user from database | :heavy_check_mark:

There are some information you should know:

1. If a user is not found, the API will throw an 404 error;
2. If a user exists, it will bring the necessary information with it (not bringing sensitive data).

## Listing users (GET)

Endpoint: `/users`.

To list all users from database you don't need to provide any information to the
API.

Request property | Description | Required
---------------- | ----------- | --------
N/A | N/A | N/A
