#!/usr/bin/env node
var arDrone = require('ar-drone'),
    leap    = require('leapjs').Leap;


module.exports = App = function(ops) {
  ops = ops || {};
  this.debug   = ops.debug || false;
  this.running = false;
  this.flying  = false;
  this.ref     = {};
  this.pcmd    = {};
  this.client   = arDrone.createClient();
  this.client.animateLeds('blinkOrange', 1, 10);
//  this.drone   = arDrone.createUdpControl();
  this.controller = new leap.Controller({enableGestures: true});
  this.controller.connect();
  this.controller.on('frame', this.loop.bind(this));
  this.i = 0;
  this.circleCount = 0;
};

App.prototype.takeoff = function() {
  this.log("Taking off...");
//  this.ref.emergency = false;
  this.ref.fly = true;
//  this.pcmd = {};
  this.running = true;
  this.client.takeoff();
  this.client.animateLeds('blinkGreenRed', 25, 5);
//  this.exec();
};

App.prototype.log = function() {
  if( this.debug ) console.log(arguments);
};

App.prototype.panic = function() {
  this.log("PANIC!!");
  this.ref.emergency = true;
  this.ref.fly = false;
};

App.prototype.land = function() {
  this.log("Landing...");
  this.client.land();
  this.ref.fly = false;
  this.client.animateLeds('blinkOrange', 5, 4);
//  this.pcmd = {};
//  this.exec();
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
  this.handleGestures(frame);
//  this.exec();
};

App.prototype.doFlip = function() {

    this.log('Flippety flip!');

   this.client.animate('flipRight', 50);
   this.client.stop();
};

//App.prototype.exec = function() {
//  this.drone.ref(this.ref);
//  this.drone.pcmd(this.pcmd);
//  this.drone.flush();
//};


App.prototype.handleHands = function(frame) {

    var hands = frame.hands;

    if( hands.length > 0 ) {

        var firstHand = hands[0];
        var position  = firstHand.palmPosition;
        var xPos      = position[0];
        var yPos      = position[1];
        var zPos      = position[2];

        var adjustedXPos = xPos / 250;

        var adjustedYPos = (yPos - 60) / 500;

        var adjustedZPos = (zPos / 200)

        //this.log("z position", zPos)

        if( adjustedXPos < 0 ) {

            var leftAmount = sanitizeNum(-adjustedXPos);

            //this.log('left', leftAmount);

            if( this.ref.fly ) {
                this.client.left(leftAmount);
            }

        } else if( adjustedXPos > 0 ) {

            var rightAmount = sanitizeNum(adjustedXPos);

            //this.log('right', rightAmount);

            if( this.ref.fly ) {
                this.client.right(rightAmount);
            }
        }

        if( adjustedYPos >= 0.5 ) {

            var upAmount = sanitizeNum((adjustedYPos - 0.5)*1.2);

            //this.log('upAmount', upAmount);

            if( this.ref.fly ) {
                this.client.up(upAmount);
//                this.pcmd.up = upAmount;
            }

        } else {

            var downAmount = sanitizeNum((0.5 - adjustedYPos)*1.2);

            //this.log('downAmount', downAmount);

            if( this.ref.fly ) {
                this.client.down(downAmount);
//                this.pcmd.down = downAmount;
            }

        }

        if (adjustedZPos < 0) {

            var forwardAmount = sanitizeNum(-adjustedZPos) / 3;

            //this.log('forward', forwardAmount);

            if( this.ref.fly ) {
                this.client.front(forwardAmount);
            }

        } else if( adjustedZPos > 0 ) {

            var backAmount = sanitizeNum(adjustedZPos) / 3;

            //this.log('back', backAmount);

            if( this.ref.fly ) {
                this.client.back(backAmount);
            }
        }

    } else {
        this.client.stop();
    }

};

App.prototype.handleGestures = function(frame) {

    var gestures = frame.gestures;

     if( gestures && gestures.length > 0 ) {

         for( var i=0; i < gestures.length; i++ ) {

             var gesture = gestures[i];

             if( gesture.type == 'circle' ) {

                 if( gesture.state == 'start' ) {

                    //this.log('Start circle');//, gesture);
                     this.circleCount = 0;

                 } else if( gesture.state == 'update' ) {

                     this.circleCount++;

                     //var clockwiseness = '';
                     //this.log('Number of circles:', gesture.progress);
                     //if (gesture.pointable.direction.angleTo(.normal()) <= PI/4) { clockwiseness = "clockwise"; } else { clockwiseness = "counterclockwise"; }

                 } else if( gesture.state == 'stop' ) {

                     this.log('Circle gesture!', this.circleCount);

                     if( this.ref.fly && this.circleCount > 8 ) {
                         this.doFlip();
                     }

                 }

             } else if ( gesture.type == 'keyTap' ) {
                if (this.ref.fly) {
                    this.takeoff();
                }
                else {
                    this.land();
                }

             } else {
                 //console.log("gesture", gesture)
             }

         }

    }

};

function sanitizeNum(num) {
  if( num < 0 ) return 0;
  else if ( num > 0.95 ) return 0.95;
  return num;
}
