#!/usr/bin/env node

var arDrone = require('ar-drone');
var Leap = require('leapjs').Leap;

var client = arDrone.createClient();

client.takeoff();

client
  .after(5000, function() {
    this.clockwise(0.5);
  })
  .after(3000, function() {
    this.animate('flipLeft', 15);
  })
  .after(1000, function() {
    this.stop();
    this.land();
  });

Leap.loop(function(frame) {

    console.log(frame);

});