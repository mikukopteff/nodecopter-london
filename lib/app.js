#!/usr/bin/env node

var arDrone = require('ar-drone');
var Leap = require('leapjs').Leap;

module.exports = App = function() {

    this.client = arDrone.createClient();
    this.leapController = new Leap.Controller({enableGestures: true});
    this.leapController.connect();
    this.running = false;
    this.i = 0;
    this.clientEnabled = false;

    console.log('Client enabled:', this.clientEnabled);

};


App.prototype =  {

    takeoff: function() {

        console.log('takeoff');

        if( this.clientEnabled ) {
            this.client.takeoff();
        }
    },

    land: function() {

        console.log('land');

        this.running = false;

        if( this.clientEnabled ) {
            this.client.land();
        }
    },

    init: function() {

        console.log('init');

        this.leapController.on('frame', leapLoop.bind(this));

        this.leapController.on('gesture', function(gesture) {
            console.log('gesture!', gesture)
        });

        if( this.clientEnabled ) {
            this.client.animateLeds('blinkGreen', 5, 3);
        }

    },

    start : function() {

        console.log('start');

        this.running = true;
    },

    stop : function() {

        console.log('stop');

        this.running = false;
    },

    handleHands: function(frame) {

        var hands = frame.hands;

        if( hands.length > 0 ) {

            var firstHand = hands[0];
            var position = firstHand.palmPosition;
            var yPos = position[1];

            //console.log(yPos);

            var adjustedYPos = (yPos - 60) / 500;

            //console.log('adjustedYPos', adjustedYPos);

            if( adjustedYPos >= 0.5 ) {

                var upAmount = adjustedYPos - 0.5;

                console.log('upAmount', upAmount);

                if( this.clientEnabled ) {
                    this.client.up( upAmount );
                }

            } else {

                var downAmount = 0.5 - adjustedYPos;

                console.log('downAmount', downAmount);

                if( this.clientEnabled ) {
                    this.client.down( 0.5 - adjustedYPos );
                }

            }

        }

    },

    handleGestures: function(frame) {

        var gestures = frame.gestures;

         if( gestures && gestures.length > 0 ) {

             for( var i=0; i < gestures.length; i++ ) {

                 var gesture = gestures[i];

                 if( gesture.type == 'circle' ) {

                     if( gesture.state == 'start' ) {

                        //console.log('Start circle');//, gesture);

                     } else if( gesture.state == 'update' ) {

                         //var clockwiseness = '';
                         //console.log('Number of circles:', gesture.progress);
                         //if (gesture.pointable.direction.angleTo(.normal()) <= PI/4) { clockwiseness = "clockwise"; } else { clockwiseness = "counterclockwise"; }

                     } else if( gesture.state == 'stop' ) {

                         console.log('Circle gesture!');

                         if( this.clientEnabled ) {
                            this.client.animate('flipRight');
                         }

                     }

                 }

             }

        }

    }

};


function leapLoop(frame) {

    if( this.running ) { //((this.i++) % 10 == 0) && this.running ) {

        this.handleHands(frame);

        this.handleGestures(frame);

    }

    //if( this.i == 100 ) this.i = 0;
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
