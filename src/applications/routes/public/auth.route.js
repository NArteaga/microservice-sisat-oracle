module.exports = (app, { controllers: { token } }) => {
  app.post('/auth/generate/token', token.generate)

  return app
}
