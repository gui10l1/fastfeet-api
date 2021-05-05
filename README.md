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

1. Create a new `ormconfig.json` at the source of the project (use ormconfig.exemple.json to help you);
2. Define `host`, `port`, `username`, `password`, and the `database`;
3. Check if the connection works by running `yarn dev` in the console;
4. Run `yarn typeorm migration:run` in the console to create database tables;
5. Run `yarn dev` to initiate the development server.

For more information to deal with Typeorm read the [docs](https://typeorm.io/#/).

## Environment variables

FastFeet API needs all the environment variables, and is necessary for you to
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
(`json`).

Request property | Description | Required
---------------- | ----------- | --------
`name` | Define user's name | :heavy_check_mark:
`cpf` | Define the user's CPF, it will be for authentication | :heavy_check_mark:
`email` | Define user's email, it will be used for recovering password | :heavy_check_mark:
`password` | Define user's password, it will be used for authentication | :heavy_check_mark:
`deliveryMan` | Define if a user is a delivery man or not. It doesn't need to be provided if you are creating a delivery man user, but it's required when creating a admin user | :x:
`adminId` | It will be used to check if you have permissions to create a new admin user. The property `deliveryMan` and `adminId` are used together, if you provide one of them, then you need to provide the other one | :x:

There are some information you should know:

1. The first admin user is created automatically by runnig migrations the CPF and password for authentication are: **00000000000**, **secret_password**;
2. To create a new admin user you need to provide a user admin id inside the property `adminId` at the request body, so the API can check if you have permissions to do such action;
3. To create a admin user you need to provide a property called `deliveryMan` (boolean) and give it a false value;
4. To create a delivey man you can just provide your data and send the request.

### Finding a specific user (GET)

Endpoint: `/users/:id`.

To find a specific user you just need to provide the user id at the request
params.

Request property | Description | Required
---------------- | ----------- | --------
`id` | Parameter to find one user from database | :heavy_check_mark:

There are some information you should know:

1. If a user is not found, the API will throw an 404 error;
2. If a user exists, it will bring the necessary information with it (not bringing sensitive data).

### Listing users (GET)

Endpoint: `/users`.

To list all users from database you don't need to provide any information to the
API.

Request property | Description | Required
---------------- | ----------- | --------
N/A | N/A | N/A

### Editing users (PUT)

Endpoint: `/users`

To update a user you don't need to provide all user information, it means that
you just need to provide what you want to change. Request body needs to be in
`json`.

Request property | Description | Required
---------------- | ----------- | --------
`name` | Define a new user's name | :x:
`cpf` | Define a new user's CPF | :x:
`email` | Define a new user's email | :x:
`password` | Define a new user's password | :x:
`oldPassword` | API will use this property to ensure that it's the owner who is doing the changes | :x:
`deliveryMan` | Define if a user is a delivery man or not | :x:

There are some information you should know:

1. You can't update a user that not exists;
2. If you want to change user's password, you need to provide the old one;
3. You can't update user's email to one that already is in use, but if the email matches with his old one nothing happens;
4. You can't update user's CPF to one that already is in use.

### Deleting users (DELETE)

Endpoint: `/users/:id`

To delete a user from database you need to provide the id from the user you want
to remove as URL params.

Request property | Description | Required
---------------- | ----------- | --------
`id` | Id from the user that will be deleted from database | :heavy_check_mark:

There are some information you should know:

1. Only admins users can delete any user provided;
2. Common users (delivery men) can only delete themselves;
3. If you are trying to delete a user that doesn't exist in database API will return a 404 error;
4. This endpoint return, if succeed, a 204 http status response.

### Creating sessions (POST)

Endpoint: `/sessions`

To create a session you need to provide user's CPF and password inside the
request body, and it needs to be in `json`.

Request property | Description | Required
---------------- | ----------- | --------
`cpf` | This will be used to check if this user exists in database | :heavy_check_mark:
`password` | This will be used to check if it's the own user who is making the request | :heavy_check_mark:

There are some information you should know:

1. This API uses JWT for authentication, so if the authentication succeed, this endpoint will return the JWT token, and the user who did auth;
2. JWT token payload has the user id inside it's encryption.
