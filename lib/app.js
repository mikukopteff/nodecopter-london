#!/usr/bin/env node

var arDrone = require('ar-drone');
var Gesture = require('leapjs').Gesture;
var Leap = require('leapjs').Leap;
var Motion = require('leapjs').Motion;


module.exports = App = function() {
    this.client = arDrone.createClient();
    this.running = false;
    this.i = 0;
};


App.prototype =  {
    takeoff: function() {
        this.client.takeoff();
    },

    land: function() {
        this.running = false;
        this.client.land();
    },

    init: function() {
        Leap.loop({enableGestures: true}, leapLoop.bind(this));
    },

    start : function() {
        this.running = true;
    },

    stop : function() {
        this.running = false;
    }
};


function leapLoop(frame) {
    if( ((this.i++) % 10 == 0) && this.running ) {

        var hands = frame.hands;

        if( hands.length > 0 ) {

            var firstHand = hands[0];

            ///console.log(firstHand);

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





//Leap.loop({enableGestures: true}, function(frame) {
//
//    //console.log(frame);
//
//    if( i % 10 == 0 ) {
//
//        var hands = frame.hands;
//
//        if( hands.length > 0 ) {
//
//            var firstHand = hands[0];
//
//            ///console.log(firstHand);
//
//            var position = firstHand.palmPosition;
//
//            var yPos = position[1];
//
//            console.log(yPos);
//
//            var adjustedYPos = (yPos - 60) / 50;
//
//            console.log('adjustedYPos', adjustedYPos);
//
//            client.up( adjustedYPos );
//
//        }
//
//    }
//
//    i++;
//
//    if( i == 100 ) i = 0;
//
//
//    /*
//     var fingers = frame.fingers;
//
//     if( fingers.length > 0 ) {
//
//     var firstFinger = fingers[0];
//
//     var position = firstFinger.tipPosition;
//
//     // Invert
//     var zPosition = -position[2];
//
//     var adjustedZPosition = (zPosition - 20) / 10;
//
//     console.log('adjustedZPosition', adjustedZPosition);
//
//     }
//     */
//
//    /*
//     var gestures = frame.gestures;
//
//     if( gestures && gestures.length > 0 ) {
//
//     for( var i=0; i < gestures.length; i++ ) {
//
//     var gesture = gestures[i];
//
//     if( gesture.state == 'start' ) {
//
//     console.log('Start circle');//, gesture);
//
//     } else if( gesture.state == 'update' ) {
//
//     //var clockwiseness = '';
//
//     console.log('Number of circles:', gesture.progress);
//
//     //if (gesture.pointable.direction.angleTo(.normal()) <= PI/4) { clockwiseness = "clockwise"; } else { clockwiseness = "counterclockwise"; }
//
//     } else if( gesture.state == 'stop' ) {
//
//     console.log('Stop circle');//, gesture);
//
//     }
//
//     }
//
//     }
//     */
//
//});
