module.exports = (app, { controllers: { entidad } }) => {
  app.get('/entidad', entidad.findAll)

  return app
}
