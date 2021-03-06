# tdf-maptime

## [Live Site](http://abenrob.github.io/tdf-maptime/)

forked and modified from https://github.com/mapbox/running-map-example

## [Annotated Documentation](http://www.abenrob.com/tdf-maptime/docs/)

This is pulled together using [browserify](http://browserify.org/):
the libraries it depends on are tracked in the [package.json](package.json)
file and pulled in with the [npm](https://www.npmjs.com/) utility.

The end result is a static site (despite being 'built' with node) that you
can host on [GitHub Pages](https://pages.github.com/) or any other host.

## Install

```sh
$ npm install
```

## Run For Development

This will dynamically recompile the project and serve it up at http://localhost:1337/

```sh
$ npm start
```

## Build for Production

```sh
$ npm run build
```
