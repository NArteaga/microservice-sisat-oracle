const express = require('express')
const { json } = require('body-parser')
const { createServer } = require('http')
const { config } = require('dotenv')
const { dependecies, routes } = require('./common/load')
config()

const app = express()
//INFO configuracion inicial

app.use(json({ limit: '10mb' }))

const load = async (app) => {
  const config = await dependecies(__dirname)
  app.use('/api', routes(__dirname, config))
}
load(app)

app.get('/api/status', (_, res) => {
  const date = new Date();
  return res.status(200).send({
    finalizado: true,
    mensaje: 'Funcionando correctamente',
    datos: {
      code: Buffer.from(date.toString()).toString('base64'),
      anio: date.getFullYear(),
      mes: date.getMonth() + 1,
      dia: date.getDate()
    }
  })
})

app.use((err, req, res, next) => {
  if (!err) next()
  if (err?.message?.match(/not found/)) return res.status(404).send({ error: err.message })
  if (err?.message?.match(/jwt expired/))
    return res.status(401).send({ error: 'Su sesión ha expirado, ingrese nuevamente al sistema.' })
  if (err?.message?.match(/No authorization/))
    return res.status(403).send({ error: 'No tiene permisos para realizar esta operación.' })
  if (err?.message?.match(/EAI_AGAIN/))
    return res.status(400).send({ error: 'Uno de los servicios no se encuentra activo en estos momentos, vuelva a intentar dentro de unos minutos.' })
  res.status(500).send({ error: err.message })
})

const server = createServer(app);


server.listen(process.env.PORT || 3000, () => {
    console.log(`
███████╗██╗███████╗ █████╗ ████████╗    ██████╗  █████╗  ██████╗██╗  ██╗███████╗███╗   ██╗██████╗      ██████╗ ██████╗  █████╗  ██████╗██╗     ███████╗
██╔════╝██║██╔════╝██╔══██╗╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝████╗  ██║██╔══██╗    ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝
███████╗██║███████╗███████║   ██║       ██████╔╝███████║██║     █████╔╝ █████╗  ██╔██╗ ██║██║  ██║    ██║   ██║██████╔╝███████║██║     ██║     █████╗  
╚════██║██║╚════██║██╔══██║   ██║       ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║╚██╗██║██║  ██║    ██║   ██║██╔══██╗██╔══██║██║     ██║     ██╔══╝  
███████║██║███████║██║  ██║   ██║       ██████╔╝██║  ██║╚██████╗██║  ██╗███████╗██║ ╚████║██████╔╝    ╚██████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗
╚══════╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝       ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
    `)
    console.log(`server listening on port ${process.env.PORT}`);

    console.log(`🚀🚀🚀   RUTAS: APP   🚀🚀🚀`);
    console.log(`   -`, { method: 'GET', url: '/api/status'})
})