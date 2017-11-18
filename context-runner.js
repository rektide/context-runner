"use module"
"use strict"

import _resolve from "./resolve.js"

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
	for( var run of contextRun){
		// Resolve this piece, and assign the resolved value back on the run-context.
		ctx[ run]= await contextResolve( ctx[ run], defaults[ run], ctx)
	}
	return ctx
}
