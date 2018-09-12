# My Lineman Application

Run app: npm start

The app will be running at localhost:8000

Run specs in CI: npm test

Run continuous specs: npm run spec

## Structure

This app is a very simple [lineman](http://linemanjs.com/) app. It contains no UI frameworks, and your first task is not to install React but to work within the constraints that are given.

Tests are run with testem, and written with Jasmine. You can find the first test in `spec/hello-spec.js`. It's currently using Jasmine-Given, but you don't have to use it. The template uses [underscore](https://underscorejs.org/#template) templates (and has underscore available) which are found in the `templates` and loaded into the `JST` object. You can look at `hello.js` to see how it works and at the Lineman docs for specifics.
