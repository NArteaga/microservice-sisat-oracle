module.exports = (app, { controllers: { liquidacion } }) => {
  app.post('/generate', liquidacion.generate)
  app.get('/view', liquidacion.findViewLiquidation)

  return app
}
