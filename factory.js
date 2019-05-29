import socketIo from 'socket.io-client'

export default function socketFactory (url, debug = true) {
  const socket = { io: null }

  function log (...args) {
    if (debug) {
      console.log(...args)
    }
  }

  function connect (dispatch, jwt = null) {
    log('Connecting websocket...!')
    const query = `auth_token=${jwt}`
    socket.io = socketIo.connect(url, { query })

    log('Websocket connected!')

    function onAction (action) {
      log('Action received:', action)

      // Test if action is plain object
      if (action === Object(action)) {
        dispatch(action)
      } else {
        const warning = 'A socket action was not an object and will not be dispatched.'
        console.warn(warning)
      }
    }

    socket.io.on('action', onAction)
  }

  function disconnect () {
    log('Disconnecting websocket...')

    socket.io.disconnect()

    log('Websocket disconnected!')
  }

  return { socket, connect, disconnect }
}
