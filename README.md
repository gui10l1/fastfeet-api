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

* MAIL_PROVIDER

FastFeet API uses different mail providers and it's defined by one environment
variable that is **MAIL_PROVIDER**. By now, there are only one option to
provide: sandbox. If you provide any other different value, FastFeet API will
throw an **error** when you try to use a service with this provider
implementation.

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

# Users

How to create, update, find, list, and delete users. Users can be admin users
and delivery men. If you want to create a user as a client go to Client module
session.

## Creating a new user (POST)

Endpoint: `/users`.

To create a new user you need to provide the data below in the request body
(`json`).

Request property | Description | Required
---------------- | ----------- | --------
`name` | Define user's name | :heavy_check_mark:
`cpf` | Define the user's CPF, it will be for authentication | :heavy_check_mark:
`email` | Define user's email, it will be used for recovering password and account verification | :heavy_check_mark:
`password` | Define user's password, it will be used for authentication | :heavy_check_mark:
`deliveryMan` | Define if a user is a delivery man or not. It doesn't need to be provided if you are creating a delivery man user, but it's required when creating a admin user | :x:
`adminId` | It will be used to check if you have permissions to create a new admin user. The property `deliveryMan` and `adminId` are used together, if you provide one of them, then you need to provide the other one | :x:

There are some information you should know:

1. The first admin user is created automatically by runnig migrations the CPF and password for authentication are: **00000000000**, **secret_password**;
2. To create a new admin user you need to provide a user admin id inside the property `adminId` at the request body, so the API can check if you have permissions to do such action;
3. To create a admin user you need to provide a property called `deliveryMan` (boolean) and give it a false value;
4. To create a delivey man you can just provide your data and send the request.

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

## Editing users (PUT)

Endpoint: `/users/:id`

To update a user you don't need to provide all user information, it means that
you just need to provide what you want to change, but you need to provide his
id at the request params. Request body needs to be in `json`.

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

## Deleting users (DELETE)

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

## Creating sessions for USERS (POST)

*If you are looking for clients authentication, go to this [section](#creating-sessions-for-clients-post).*

Endpoint: `/sessions/user`

To create a session you need to provide user's CPF and password inside the
request body, and it needs to be in `json`.

Request property | Description | Required
---------------- | ----------- | --------
`cpf` | This will be used to check if this user exists in database | :heavy_check_mark:
`password` | This will be used to check if it's the own user who is making the request | :heavy_check_mark:

There are some information you should know:

1. This API uses JWT for authentication, so if the authentication succeed, this endpoint will return the JWT token, and the user who did auth;
2. JWT token payload has the user id inside it's encryption.

# Client

How to create clients. Clients are users who can buy and order stuff inside the
application.

## Creating clients (POST)

Endpoint: `/clients`.

To create a new client you need to provide information below inside the request
body which needs to be in `json`.

Request property | Description | Required
---------------- | ----------- | --------
`name` | Define client's name | :heavy_check_mark:
`email` | Define client's email. It will be used for authentication, password recovery, and account verification | :heavy_check_mark:
`password` | Define client's password. It will be used for authentication | :heavy_check_mark:
`postalCode` | Define client's postal code. It is not necessary to provide, it means that the client can set it later at the account settings | :x:

There is no rules for clients, anybody can create them.

## Editing clients (PUT)

Endpoint: `/clients`

To update a client you don't need to provide all his information, it means that
you just need to provide what you want to change. Request body needs to be in
`json`. This route requires authentication for clients.

Request property | Description | Required
---------------- | ----------- | --------
`name` | Define new client's name | :x:
`email` | Define new client's email. | :x:
`password` | Define new client's password. It will be used for authentication | :x:
`postalCode` | Define new client's postal code. It is not necessary to provide, it means that the client can set it later at the account settings | :x:

There are some information you should know:

1. You can't update a client that not exists, if tried, API will throw an 404 error;
2. To update password, clients need to provide their old password;
3. Clients cannot update email to one that already is in use, but if their email matches with their old ones nothing happens. If they change their email, a confirmation will be sent to their new email address;

## Creating sessions for CLIENTS (POST)

*If you are looking for users (admin, delivery men) authentication, go to this [section](#creating-sessions-for-users-post).*

Endpoint: `/sessions/client`.

To create a session for a client you need to provide all information below
inside the request body which needs to be in `json`.

Request property | Description | Required
---------------- | ----------- | --------
`email` | API will check if the client exists inside the database by this parameter | :heavy_check_mark:
`password` | API will check if it is the own client who is making the request | :heavy_check_mark:

There are some information you should know:

1. This API uses JWT for authentication, so if the authentication succeed, this endpoint will return the JWT token, and the client who did auth;
2. JWT token payload has the user id inside it's encryption.

# Deliveries

There is a lot of functionalities for deliveries. It's inside this module where
most of business rules of this API are in. This module is divided in two:
*deliveries* itself, and *delivery men*.

## Deliveries

Here you will find out how to create a new delivery.

### Creating a new delivery (POST)

Endpoint: `/deliveries`.

This route creates a new delivery, it requires authentication for clients,
and you need to provide all information below inside the request body which
needs to be in... `json` =D.

Request property | Description | Required
---------------- | ----------- | --------
`recipientId` | This will define who requested the delivery (client) | :heavy_check_mark:
`postalCode` | Define client's postal code | :heavy_check_mark:
`product` | Define the product | :heavy_check_mark:
`address` | Client's address | :heavy_check_mark:
`neighborhood` | Client's neighborhood | :heavy_check_mark:
`city` | Client's city | :heavy_check_mark:
`state` | Client's state | :heavy_check_mark:

There are some information you should know:

1. You cannot create a delivery from a non-existing client;
2. When the delivery is request successfully will be sent a email to the client's mail box alerting him about it;
3. Only **clients** can request deliveries.

### Canceling deliveries (PATCH)

Endpoint: `/deliveries/cancel/:deliveryId`.

This route ables to the client to cancel a delivery. This endpoint requires
authentication and the delivery id to cancel.

Request property | Description | Required
---------------- | ----------- | --------
`deliveryId` | API will use this id for multiple checks | :heavy_check_mark:

1. This route returns void;
2. It's not able to cancel a delivery that has not been requested by you;
3. It's not able to cancel a delivery that does not exist.

## Delivery men

Here you will find out how to list finished deliveries, accept delivery to
withdraw and then deliver. Let's get started.

### Listing finished deliveries (GET)

Endpoint: `/delivery-men/me/finished-deliveries`.

This route will bring all deliveries that has been delivered by one specific
delivery man. This is a GET route and you need to provide no data, but you need
to be authenticated to access it.

Request property | Description | Required
---------------- | ----------- | --------
N/A | N/A | N/A

There are some information you should know:

1. You need to be authenticated as a delivery man to see your finished deliveries;
2. Admin cannot access this route since they are not delivery men;
3. If you try to access finished deliveries from a non-existing delivery man, the API will throw an 400 http error.

### Accepting deliveries to deliver (PATCH)

Endpoint: `/delivery-men/delivery/:deliveryId/accept`.

Here you will be able to accept a delivery to a delivery man, after the
accepting, he will be able to withdraw this delivery and then deliver it. This
route requires authentication for delivery men, and requires route params
indicating the delivery's id that he (delivery man) is accepting.

Request property | Description | Required
---------------- | ----------- | --------
`deliveryId` | The delivery id, it goes inside the route params and will be used by the API for multiple checks | :heavy_check_mark:

There are some information you should know:

1. The return from this route is void.

### Withdrawing a delivery (PATCH)

Endpoint: `/delivery-men/deliveries/:deliveryId/withdraw`.

After accepting a delivery, delivery man will have an option to withdraw this
delivery and deliver it to the recipient. This route requires athentication for
delivery men, and requires route params indicating the delivery's id that he
(delivery man) is withdrawing.

Request property | Description | Required
---------------- | ----------- | --------
`deliveryId` | The delivery id, it goes inside the route params and will be used by the API for multiple checks | :heavy_check_mark:

There are some information you should know:

1. The return from this route is void.

### Finishing a deliveries (PATCH)

Endpoint: `/delivery-men/deliveries/:deliveryId/finish`.

When the delivery is being delivered, the delivery man will be able to finish it.
This route requires the delivery id that comes inside the route params, and a
client's signature photo.

Request property | Description | Required
---------------- | ----------- | --------
`deliveryId` | The delivery id, it goes inside the route params and will be used by the API for multiple checks | :heavy_check_mark:
`signature-photo` | This will be saved inside the API according storage provider and inside the database | :heavy_check_mark:

There are some information you should know:

1. The return from this route is void.
2. You can't finish a delivery that does not exist;
3. You can't finish a delivery that does not have a recipient;
4. You can't finish a delivery that has already been finished.

## Products

This section will help you to deal with products endpoints.

### Creating a new product (POST)

Endpoint: `/products`.

To create a new product you need to be a admin user and provide all information
for it.

Request property | Description | Required
---------------- | ----------- | --------
`name` | This sets the product's name
