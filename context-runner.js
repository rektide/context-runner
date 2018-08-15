"use module"
"use strict"

import _resolve from "./resolve.js"

function defer(){
	var
	  _reject,
	  _resolve,
	  promise= new Promise(function( resolve, reject){
		_resolve= resolve
		_reject= reject
	  })
	Object.defineProperties( promise, {
		resolve: { value: _resolve},
		reject: { value: _reject}
	})
	return promise
}

/**
  In order, `key` on `ctx`, turning it's aswith `defaults` if context 
*/
export default async function( ctx, defaults, contextRun){
	ctx= await ctx|| {}
	// A context can specify it's own defaults to override passed in ones
	ctx.defaults= await ctx.defaults|| await defaults|| {}
	var
	  // Find the tool we use to resolve a piece of context, falling extra far back
	  // to passed in default if needed, & using _resolve as a final default
	  contextResolve= await ctx.contextResolve|| await ctx.defaults.contextResolve|| await (defaults&& defaults.contextResolve)|| _resolve
	  // Resolve the defaults we intend to use from now on
	  defaults= await contextResolve( ctx.defaults, defaults, ctx)
	// Specifies the order we're going to resolve pieces-
	// 1. Use arg provided if available
	// 2. Look for a contextRun property that specifies if available
	// 3. Fallback for order of keys in defaults
	contextRun= await contextRun|| await contextResolve( ctx.contextRun, defaults.contextRun, ctx)|| Object.keys( defaults)
	// predefine every element so everyone can depend on this ctx items. run no functions (hich might be async).
	for( const run of contextRun){
		if( ctx[ run]!== undefined){
			// already defined, next
			continue
		}
		const def= defaults[ run]
		if( defaults[ run] instanceof Function){
			// allow others to depend on the eventual value of this function
			ctx[ run]= defer()
		}else{
			// defaults is a concrete value already, assign it
			ctx[ run]= def
		}
	}
	// really run through each item
	for( var run of contextRun){
		// Begin the run for this piece
		var execution= contextResolve( ctx[ run], defaults[ run], ctx)
		// When done, resolve the value back on to the run-context
		execution.then( execution=> this[ run].resolve( execution); this[ run]= execution)
		// Resolve this piece
		await execution
	}
	return ctx
}
