const app = require('./app')
const hostname = app.get('host')
const port = app.get('port')
const server = app.listen(port, hostname)

process.on('unhandledRejection', (reason, p) =>
  app.get('logger').error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () =>
  app.get('logger').log({
    level: 'info',
    label: 'start server',
    message: `Feathers application started on http://${hostname}:${port}`
  })
)
