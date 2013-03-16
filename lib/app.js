#!/usr/bin/env node
var arDrone = require('ar-drone'),
    leap    = require('leapjs'),
    Gesture = require('leapjs').Gesture,
    Motion  = require('leapjs').Motion;


module.exports = App = function() {
  this.running = false;
  this.debug   = false;
  this.ref     = {};
  this.pcmd    = {};
  this.drone   = arDrone.createUdpControl();
  this.controller = new leap.Controller({enableGestures: true});
  this.i = 0;
};

App.prototype.takeoff = function() {
  this.running = true;
  this.ref.emergency = false;
  this.ref.fly = true;
  this.pcmd = {};
  this.exec();
};

App.prototype.panic = function() {
  this.ref.emergency = true;
  this.ref.fly = false;
};

App.prototype.land = function() {
  this.running = false;
  this.ref.fly = false;
  this.pcmd = {};
  this.exec();
};

App.prototype.start = function() {
  this.running = true;
};

App.prototype.stop = function() {
  this.running = false;
};

App.prototype.loop = function() {
  if( !this.running) return;
  this.exec();
};

App.prototype.exec = function() {
  this.drone.ref(this.ref);
  this.drone.pcmd(this.pcmd);
  this.drone.flush();
};


function leapLoop(frame) {
  if( ((this.i++) % 10 == 0) && this.running ) {

    var hands = frame.hands;

    if( hands.length > 0 ) {

      var firstHand = hands[0];

      var position = firstHand.palmPosition;

      var yPos = position[1];

      console.log(yPos);

      var adjustedYPos = (yPos - 60) / 500;

      //console.log('adjustedYPos', adjustedYPos);

      if( adjustedYPos >= 0.5 ) {

        var upAmount = adjustedYPos - 0.5;

        //console.log('upAmount', upAmount);

        this.client.up( upAmount );

      } else {

        var downAmount = 0.5 - adjustedYPos;

        //console.log('downAmount', downAmount);

        this.client.down( 0.5 - adjustedYPos );

      }

//            this.client.up( adjustedYPos );
    }

  }

  if( this.i == 100 ) this.i = 0;
}
