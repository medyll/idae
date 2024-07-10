const throttle_delay        = 100,
      throttle_queue: any[]        = [],
      throttle_trigger_size = 10;

let throttle_timer: any = null,
    throttle_elem  = null;

export const socketThrottle = (data: any, fn: Function)=> {
	
	console.log ('throttling ', data, throttle_queue, throttle_queue.length);
	
	if ( data ) {
		throttle_queue.push (data);
	}
	if ( !throttling_reached () && data ) {
		throttling_execute (data, true);
		return true;
	}

	throttling_run ();
	
}

function throttling_execute   (data: any, from: any) {
	console.log (data, from)
}

function throttling_reached   () {
	return (throttle_queue.length  >= throttle_trigger_size)
}
function throttling_run      () {
	
	if ( !throttle_timer ) {
		throttle_timer = setInterval (function () {
			throttling_shift ()
		}, throttle_delay);
	}
	
}
function throttling_shift    () {
	
	throttle_elem = throttle_queue[0];
	throttle_queue.shift ();
	
	console.log (throttle_elem)
	
	throttling_execute (throttle_elem, true);
	
	// console.log(throttle_timer)
	if ( throttle_queue.length === 0 ) {
		clearInterval (throttle_timer);
		throttle_timer = false;
	}
}

