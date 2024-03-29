# CMonitor

![Alt text](/src/assets/screenshots/homepage.PNG?raw=true)
&nbsp;&nbsp;
&nbsp;&nbsp;

![Alt text](/src/assets/screenshots/news.PNG?raw=true)
&nbsp;&nbsp;
&nbsp;&nbsp;

![Alt text](/src/assets/screenshots/prices.PNG?raw=true)
&nbsp;&nbsp;
&nbsp;&nbsp;

![Alt text](/src/assets/screenshots/portfolio-page.PNG?raw=true)
&nbsp;&nbsp;
&nbsp;&nbsp;

## ** This project is my first experience with NodeJs and Angular2+. It was made mainly for educational purposes. Bad practices are to be found here ** ##

The news API, which was free, has been retired in favour of a paid version. Therefore, some errors are to be expected too.

The project stack is MongoDB, NodeJs, Express, Angular8.

It is somewhat similar to MEAN (https://github.com/linnovate/mean), I could have started from there, but I wanted to learn by structuring the project myself, instead of relying on something pre-prepaired. It's probable, for this reason, that MEAN is better structured than my project.

*The project isn't currently being mantained, I'm just keeping up with the security updates, to later pick up the project and migrate it to a newer version of Angular.*


## Development server - Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development server - NodeJS

The node backend is under src/app/node_bk (the choice to put it there might be questionable, but I did so for my convenience).

Run `npm run all` for the all the necessary backend server istances. Each service has its instance, with its port. (CORS settings need to be adapted to your urls manually, for now they're set to allowing all).

A different architecture might be developed, I'm a bit weak in Node, so suggestions/improvements/contributions would be very much appreciated.

## MongoDB

My local MongoDB version used in development is mongodb@3.5.0, you might check out if newer versions are compatible.

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
