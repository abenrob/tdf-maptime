# chroniton

A time slider input for time-based visualizations and data.

## Features

* Customizable label formatting
* API and UI for playing & pausing time
* Smart label position for current value
* APIs for setting and retrieving time data
* Touch-compatible for phones and such
* Keybindings for navigating with ← and →

## Installation

The most recommended technique is to use [browserify](http://browserify.org/)
and use `var chroniton = require('chroniton')` to get the library.

```sh
$ npm install --save chroniton
```

Otherwise, download `chroniton-bundle.js` for chroniton **with d3 included**,
or `chroniton-only.js` if you already are included d3 on your page as a global
variable. Use the latter, for instance, if you have a script-tag
include like `<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>`.
You'll need to copy these files to your server.

There's an example of the necessary CSS to style chroniton
in `chroniton-example.css`.

## API

This follows the [d3 reusable charts](http://bost.ocks.org/mike/chart/) pattern
and uses [d3](http://d3js.org/) internally, so documentation from that library
is useful to complement this documentation.

### `chroniton()`

Constructs a new timeline instance with default values.

All of the following API methods beginning with `.` are called on an instance
created with `chroniton()`.

This exposes a function that can either be called in a chain with [d3's selection.call](https://github.com/mbostock/d3/wiki/Selections)
method or called directly as `chroniton()(selection)`.

**Example**

```js
// using d3
d3.select(document.body)
    .append('div')
    .call(chroniton());

// or not using d3
var div = document.body.appendChild(document.createElement('div'));
chroniton()(div);
```

### `.domain([start, end])`

Given an array of two `Date` objects, set these as the earliest and latest
date selectable through the input.

**Example**

```js
d3.select(document.body)
  .append('div')
  .call(
    chroniton()
      .domain([new Date(+new Date() - 60 * 1000), new Date()])
```

### `.keybinding(true or false)`

Turn on and off the default keybindings that link arrow left & right keys
to moving the value forward and backward.

### `.labelFormat(function)`

Use a different format to show the 'now' label in the input. The default
value is `d3.time.format("%Y-%m-%d")`. The function should take a `Date`
object as an argument and return a string. See [d3.time.format](https://github.com/mbostock/d3/wiki/Time-Formatting)
documentation for hints.

**Example**

```js
d3.select(document.body)
  .append('div')
  .call(
    chroniton()
      // hours and minutes - time format
      .labelFormat(d3.time.format('%X')));
```

### `.hideLabel()`

The equvalent of calling `.labelFormat(function() { return ''; })`: this
hides the label that shows what the current value is.

### `.width(number)`, `.height(number)`

Change these dimensions of the graph.

### `.tapAxis(function)`

Call an arbitrary function on the input's axis object. Useful for calling
any of the [d3.svg.axis](https://github.com/mbostock/d3/wiki/SVG-Axes) methods
before the thing is constructed.


**Example**

```js
d3.select(document.body)
  .append('div')
  .call(
    chroniton()
      .tapAxis(function(axis) { axis.ticks(5); }));
```

### `.on('change', function)`

Listen for changes in the input. Programmatic changes also fire this event.
Calls the given callback function with a current value as a `Date` object.

**Example**

```js
d3.select(document.body)
  .append('div')
  .call(
    chroniton()
    .on('change', function(d) { alert(d); }));
```

### `.setValue(Date object, transition?)`

Set the value of the input to a given `Date` object, redraw it, and fire
a `change` event.

The `transition` argument, by default `false`, is whether the timeline
should smoothly transition between the current date and the given date.
If it's true, it'll transition with default options. Otherwise, you can
give an object with options:

* `duration`: how long the transition will take
* `ease`: [a d3 easing function](https://github.com/mbostock/d3/wiki/Transitions#d3_ease)
  given by name, like "linear"

### `.isAtEnd()` & `.isAtStart()`

Return a boolean `true` or `false` value for whether the input is at the beginning
or end of its permitted date range.

### `.playbackRate(number)`

Set the playback rate multiplier. The default is for the slider to move at 10px
per second: this will change that by a given multiplier.

### `.play()`

Start playing: this animates the slider and emits `change` events as its
value changes.

### `.pause()`

Pause playing, keeping the playhead in its current place.

### `.playButton(true or false)`

Set whether to show a play / pause button on the input. Clicking the
button plays or pauses.

### `.playPause()`

Toggles chart between playing and pausing status.

### `.stop()`

Pause playing and return the playhead to the beginning.

### `.isPlaying()`

Returns a `boolean` for whether the control is currently playing.

### `.loop(true or false)`

By default `loop` is set to `false`. You can call this function so that when
you call `.play()` the input loops once it hits the end rather than stopping.

# Development

    $ git clone git@github.com:tmcw/chroniton.git
    $ npm install

Run `npm start` to rebuild the source and start a development server on
`localhost:1337`. There's a testing page at `example/index.html`.

Run `npm run bundle` to regenerate the bundle and standalone files.
