#!/usr/bin/env node

var App = require('./lib/app'), app = new App({debug:true});

console.log( "Starting" );

app.takeoff();

setTimeout(function() {
  app.start();
}, 1000);


