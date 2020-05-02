# Cclient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

## Development server - Angular

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development server - NodeJS

The node backend is under src/app/node_bk (the choice to put it there bmight be questionable, but I did so for my convenience).

Run `npm run all` for the all the necessary backend server istances. Each service has its instance, with its port. (CORS settings need to be adapted to your urls manually, for now they're set to allowing all).

A different architecture might be developed, I'm a bit weak in Node, so suggestions/improvements/contributions would be very much appreciated.

## MongoDB

My local MongoDB version used in development is mongodb@3.5.0, you might try out if newer versions are compatible.

There's a db snapshot under src/assets/dbsnapshots, created with mongodump.

It can be restored with mongorestore --db database_name path_to_bson_file

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Tests

Here I must make amends, because I've given no attention to mantaining the test suite, I wanted to get the functionalities working.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
