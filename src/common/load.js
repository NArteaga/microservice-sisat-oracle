const { join } = require('path')
const { readdirSync, statSync, readFileSync } = require('fs')
const express = require('express')
const app = express.Router()
const { execute, transaction } = require('./db')
const logger = require('pino')()

const configInjection = {
  config: [
    {
      dir: 'infraestructures',
      container: 'repositories',
      name: '.repository',
      dependecies: { execute }
    },
    { dir: 'logics', container: 'libs', name: '', inject: '' },
    { dir: 'logics', container: 'services', name: '.service', inject: ['repositories', 'libs'], dependecies: { transaction } },
    { dir: 'applications', container: 'middlewares', name: '.middleware', inject: ['services', 'libs'] },
    { dir: 'applications', container: 'controllers', name: '.controller', inject: ['services', 'libs'] },
  ],
  dependecies: { logger },
  type: 'js',
}

const formatNameInjection = (names) => {
  return names.split('.')
    .map((name, index) => index !== 0 ? `${name[0].toUpperCase()}${name.slice(1)}` : name)
    .join('')
}

const getInjectDependecies = (dependecies, injects = []) => {
  const result = {}
  for (const inject of injects)
    result[inject] = dependecies[inject]
  return result
}

const loadDependecies = (path, config, dependecies) => {
  const files = readdirSync(path)
  let inject = {}
  for (const file of files) {
    const pathfile = join(path, file)
    if (statSync(pathfile).isDirectory())
      inject = { ...inject, ...loadDependecies(pathfile, config, dependecies) }
    const endfilename = `${config.name}.${config.type}`
    if (!file.endsWith(endfilename)) continue
    const filename = file.replace(endfilename, '')
    inject[`${formatNameInjection(filename)}`] = require(pathfile)({ ...dependecies, ...config.dependecies })
  }
  return inject
}

const loadRoutes = (path, app, directory, config, dependecies, url, verifyToken = false) => {
  try {
    const files = readdirSync(path)
    for (const file of files) {
      const pathfile = join(path, file)
      if (statSync(pathfile).isDirectory()) {
        const router = express.Router()
        const nextVerificateToken = !url.includes('public') && !url.includes('auth') && !['auth', 'public'].includes(file)
        loadRoutes(pathfile, router, file, config, dependecies, `${url}/${file}`, nextVerificateToken)
        app.use(`/${directory}`, router)
      }
      const endfilename = `${config.name}.${config.type}`
      if (!file.endsWith(endfilename)) continue
      const filename = file.replace(endfilename, '')
      console.log(`🚀🚀🚀   RUTAS: ${filename.toUpperCase()}   🚀🚀🚀`);
      getRoutes(pathfile, url)
      const route = require(pathfile)(app, dependecies)
      if (verifyToken)
        app.use(`/${directory}/*`, dependecies.middlewares.jwt.verificar(), dependecies.middlewares.rol.verificar())
      app.use(`/${directory}`, route)
    }
  } catch (error) {
    console.log(error) 
  }
}

const getRoutes = (path, urlBase) => {
  const content = readFileSync(path, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(text => text.startsWith('app.'))
  content.forEach(line => {
    line = line.substring(4)
    let position = line.indexOf('(')
    const method = line.substring(0, position).toUpperCase().trim()
    line = line.substring(position + 2)
    position = line.indexOf('\'')
    if (position === -1) position = line.indexOf('"')
    const url = line.substring(0, position)
    console.log(`   -`, { method, url: `${urlBase}${url}` })
  })
}

module.exports = {
  loadDependecies,
  injectDependecies: getInjectDependecies,
  dependecies: async (path) => {
    const dependecies = {}
    for (const inject of configInjection.config) {
      dependecies[inject.container]
        = loadDependecies(
          join(path, inject.dir, inject.container),
          { ...inject, type: configInjection.type, dependecies: { ...inject.dependecies, ...configInjection.dependecies } },
          getInjectDependecies(dependecies, inject.inject)
        )
    }
    return dependecies
  },
  routes: (path, dependecies) => {
    loadRoutes(
      join(path, 'applications', 'routes'),
      app,
      '',
      { name: '.route', type: configInjection.type },
      getInjectDependecies(dependecies, ['controllers','middlewares']),
      '/api'
    )
    return app
  }
}