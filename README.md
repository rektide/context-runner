# Context Runner

> In-order means of concretizing asynchronous members of a context.

Context Runner is seen a generic, fast way to build "main" functions. By attaching promises or promise-generating functions to a `context` object, and specifying the order of keys to evaluate, context-runner will resolve in sequence each piece of asynchronous state on the context. For many programs, this can be a complete pipeline of execution.

Architecturally, this allows for a shared context object to resolve pieces of itself, while those pieces are given access to the shared, flowing context.
