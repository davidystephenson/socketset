# socketset

Connect a socket.io server to a redux store.

## Installation
Inside of the client side application that includes a redux store, add the package with `npm i socketset`.

## Usage

### Integrating with Redux
The socketset module exports a function that returns a redux middleware function.
To use it:

1. Run this function, passing it the URL of the socket.io server.
1. Pass the returned middleware to redux's `applyMiddleware` and `compose` functions with any other middleware.
1. Pass the enhancer `compose` creates to redux's `createStore` function.
1. Dispatch an action with the type `'SOCKETSET_CONNECT'` to connect to socket.io.

Here is an example which also includes the redux developer tools and the [`redux-thunk`](https://github.com/reduxjs/redux-thunk) package for illustrative purposes:

```
import { applyMiddleware, compose, createStore } from 'redux'
import reduxThunk from 'redux-thunk'
import socketset from 'socketset'

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : x => x

// 1. Run the function and pass it the socket.io server URL
const socket = socketset('localhost:4000')

// 2. Pass the returned middleware to applyMiddleware and compose
const middleware = applyMiddleware(reduxThunk, socket)

const enhancer = compose(middleware, devTools)

// 3. Pass the created enhancer to createStore
const store = createStore(reducer, enhancer)

// 4. Dispatch a 'SOCKETSET_CONNECT' action
const action = { type: 'SOCKETSET_CONNECT' }
store.dispatch(action)
```

### Dispatching actions from the server
Whenever the server emits an `'action'` event to the client, if the message is a plain object, it will be dispatched directly to the redux store.

```
// Server side
io.emit(
  'action', // the event must be 'action'
  { type: 'PING' } // This action object will be sent directly to your reducers.
  // If they contain a 'case' for 'PING', it will be handled.
)
```

### Configuring debug messages
By default, debug mode is on.
If debug mode is on, you will see browser console logs confirming when you connecting, disconnecting, and receiving actions.
To disable these logs, pass `false` as the second argument when initializing socketset.
```
socketset('localhost:4000', false) // Normal debug messages will not appear, though warnings about invalid actions will still appear.
```
