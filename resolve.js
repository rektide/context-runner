"use module"

/**
  Resolve a real value from any nested promises and functions
*/
async function resolve( o, def, arg, thisArg){
	do{
		if( o instanceof Function&& !o._noResolve){
			o= o.call( thisArg, arg)
		}
		o= await o
	}while( o instanceof Function|| o&& o.then)
	if( !o&& def){
		return resolve( def, undefined, arg, thisArg)
	}
	return o
}

export default resolve
