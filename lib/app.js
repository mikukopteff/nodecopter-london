#!/usr/bin/env node
var arDrone = require('ar-drone'),
    leap    = require('leapjs'),
    Gesture = require('leapjs').Gesture,
    Motion  = require('leapjs').Motion;


module.exports = App = function(ops) {
  ops = ops || {};
  this.debug   = ops.debug || false;
  this.running = false;
  this.flying  = false;
  this.ref     = {};
  this.pcmd    = {};
  this.drone   = arDrone.createUdpControl();
  this.controller = new leap.Controller({enableGestures: true});
  this.controller.connect();
  this.controller.loop(this.loop.bind(this));
  this.i = 0;
};

App.prototype.takeoff = function() {
  this.log("Taking off...");
  this.running = true;
  this.ref.emergency = false;
  this.ref.fly = true;
  this.pcmd = {};
  this.exec();
};

App.prototype.log = function() {
  if( this.debug ) console.log(arguments);
}

App.prototype.panic = function() {
  this.log("PANIC!!");
  this.ref.emergency = true;
  this.ref.fly = false;
};

App.prototype.land = function() {
  this.log("Landing...");
  this.running = false;
  this.ref.fly = false;
  this.pcmd = {};
  this.exec();
};

App.prototype.start = function() {
  this.log("Starting...");
  this.running = true;
};

App.prototype.stop = function() {
  this.log("Stoping...");
  this.running = false;
};

App.prototype.loop = function(frame) {
  if( !this.running) return;
  this.pcmd = {};
  this.handleHands(frame);
//  this.handleGestures(frame);
  this.exec();
};

App.prototype.exec = function() {
  this.drone.ref(this.ref);
  this.drone.pcmd(this.pcmd);
  this.drone.flush();
};


App.prototype.handleHands = function(frame) {

    var hands = frame.hands;

    if( hands.length > 0 ) {

        var firstHand = hands[0];
        var position  = firstHand.palmPosition;
        var yPos      = position[1];

        var adjustedYPos = (yPos - 60) / 500;

        if( adjustedYPos >= 0.5 ) {

            var upAmount = sanitizeNum(adjustedYPos - 0.5);

            log('upAmount', upAmount);

            if( this.ref.fly ) {
              this.pcmd.up = upAmount;
            }

        } else {

            var downAmount = sanitizeNum(0.5 - adjustedYPos);

            log('downAmount', downAmount);

            if( this.ref.fly ) {
              this.pcmd.down = downAmount;
            }

        }

    }

};

App.prototype.handleGestures = function(frame) {

    var gestures = frame.gestures;

     if( gestures && gestures.length > 0 ) {

         for( var i=0; i < gestures.length; i++ ) {

             var gesture = gestures[i];

             if( gesture.type == 'circle' ) {

                 if( gesture.state == 'start' ) {

                    //log('Start circle');//, gesture);

                 } else if( gesture.state == 'update' ) {

                     //var clockwiseness = '';
                     //log('Number of circles:', gesture.progress);
                     //if (gesture.pointable.direction.angleTo(.normal()) <= PI/4) { clockwiseness = "clockwise"; } else { clockwiseness = "counterclockwise"; }

                 } else if( gesture.state == 'stop' ) {

                     log('Circle gesture!');

                     if( this.clientEnabled ) {
                        this.client.animate('flipRight');
                     }

                 }

             }

         }

    }

}

function sanitizeNum(num) {
  if( num < 0 ) return 0;
  else if ( num > 0.8 ) return 0.8;
  return num;
}
