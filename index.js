import factory from './factory'

export default function middleware (url, debug = true) {
  const socket = factory(url, debug)

  return store => next => action => {
    if (action.type === 'SOCKETSET_CONNECT') {
      const jwt = action.payload && action.payload.jwt

      if (jwt) {
        socket.connect(store.dispatch, jwt)
      } else {
        socket.connect(store.dispatch)
      }
    } else if (action.type === 'SOCKETSET_DISCONNECT') {
      socket.disconnect()
    }

    next(action)
  }
}
