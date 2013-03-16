#!/usr/bin/env node

var App = require('./lib/app');

console.log( "Starting" );

var a = new App();

a.takeoff();

setTimeout(function() {
  a.start();
}, 1000);


