/* ========================================================================================= */
/* ================================== Small helper functions ================================ */
/* ========================================================================================= */

export function limit( v, m ) {
	return Math.min( m, Math.max( -m, v ));
}

export function rad2deg( rad ) {
	return rad * ( 180 / Math.PI );
}

export function arrayRemove( arr, element ) {
	arr.splice( arr.indexOf( element ), 1 );
}

/** Execute (if function) or return (if value) */
export function eor( v ) {
	return typeof v == 'function' ? v() : v;
}