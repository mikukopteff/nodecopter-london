Leap.loop(update);

var i = 0;

function update(frame) {

    i++

    if( i % 10 == 0 ) {

        console.log(frame);

    }

    if( i == 101 ) {
        i = 0;
    }

}