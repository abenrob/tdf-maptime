var d3 = require('d3');
var chroniton = require('../');


d3.select(document.body).append('h3').text('Defaults');
d3.select(document.body)
    .append('div')
    .call(chroniton());

d3.select(document.body).append('h3').text('Custom Label Format');
d3.select(document.body)
    .append('div')
    .call(
      chroniton()
        .labelFormat(d3.time.format('%b %e'))
        .width(500));

d3.select(document.body).append('h3').text('Specifying the date Domain');
d3.select(document.body)
    .append('div')
    .call(
      chroniton()
        .domain([new Date(+new Date() - 60 * 1000), new Date()])
        .labelFormat(d3.time.format('%X'))
        .width(500));

(function() {
d3.select(document.body).append('h3').text('Play button');
d3.select(document.body)
    .append('div')
    .call(
      chroniton()
        .domain([new Date(+new Date() - 60 * 1000), new Date()])
        .labelFormat(d3.time.format('%X'))
        .playButton(true)
        .width(400));
})();

(function() {
d3.select(document.body).append('h3').text('Using axis.ticks');
d3.select(document.body)
    .append('div')
    .call(
      chroniton()
        .domain([new Date(+new Date() - 60 * 1000), new Date()])
        .labelFormat(d3.time.format('%X'))
        .tapAxis(function(axis) { axis.ticks(5); })
        .width(200));
})();

d3.select(document.body).append('h3').text('Short timespan');
d3.select(document.body)
    .append('div')
    .call(
      chroniton()
        .domain([new Date(+new Date() - 60 * 1000), new Date()])
        .labelFormat(d3.time.format('%X'))
        .tapAxis(function(axis) { axis.ticks(5); })
        .width(200));

d3.select(document.body).append('h3').text('No label');
var eventExample = chroniton()
  .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
  .hideLabel()
  .tapAxis(function(axis) { axis.ticks(5); })
  .width(600);

d3.select(document.body)
    .append('div')
    .call(eventExample);

var output = d3.select(document.body)
    .append('pre');

eventExample.on('change', function(v) {
  output.text(v);
});

d3.select(document.body).append('h3').text('Setting the value programmatically');
var setValueExample = chroniton()
  .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
  .width(700);
d3.select(document.body)
    .append('div')
    .call(setValueExample);
d3.select(document.body)
  .append('button')
  .text('set value')
  .on('click', function() {
    setValueExample.setValue(new Date(+new Date() - 60 * 1000 * 500));
  });

(function() {
d3.select(document.body).append('h3').text('Setting the value programmatically with a transition');
var setValueExample2 = chroniton()
  .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
  .width(700);
d3.select(document.body)
    .append('div')
    .call(setValueExample2);
d3.select(document.body)
  .append('button')
  .text('set value')
  .on('click', function() {
    setValueExample2.setValue(new Date(+new Date() - 60 * 1000 * 500), true);
  });
})();

(function() {
d3.select(document.body).append('h3').text('Setting the value programmatically with transition options');
var setValueExample2 = chroniton()
  .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
  .width(700);
d3.select(document.body)
    .append('div')
    .call(setValueExample2);
d3.select(document.body)
  .append('button')
  .text('set value')
  .on('click', function() {
    setValueExample2.setValue(new Date(+new Date() - 60 * 1000 * 500), {
      duration: 5000,
      ease: 'linear'
    });
  });
})();

(function() {
d3.select(document.body).append('h3').text('Styling with CSS');
var setValueExample2 = chroniton()
  .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
  .width(700);
d3.select(document.body)
    .append('div')
    .attr('class', 'theme-example')
    .call(setValueExample2);
})();

(function() {
d3.select(document.body).append('h3').text('calling .play()');
d3.select(document.body)
    .append('div')
    .attr('class', 'theme-example')
    .call(chroniton()
      .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
      .width(700).play());
})();

(function() {
d3.select(document.body).append('h3').text('calling .play() with .loop(true)');
d3.select(document.body)
    .append('div')
    .attr('class', 'theme-example')
    .call(chroniton()
      .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
      .width(700).loop(true).play());
})();


(function() {
d3.select(document.body).append('h3').text('calling .play(), .pause(), and .stop() with buttons');
var c = chroniton()
   .domain([new Date(+new Date() - 60 * 1000 * 1000), new Date()])
   .width(700).loop(true);
d3.select(document.body)
    .append('div')
    .attr('class', 'theme-example')
    .call(c);

d3.select(document.body)
    .append('button').text('play').on('click', function() { c.play(); });

d3.select(document.body)
    .append('button').text('pause').on('click', function() { c.pause(); });

d3.select(document.body)
    .append('button').text('stop').on('click', function() { c.stop(); });

})();

d3.select(document.body).append('h3').text('Created without using a d3 selection');
var div = document.body.appendChild(document.createElement('div'));
chroniton()(div);
