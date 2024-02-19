const { error } = require('../../common/response')
const { HTTP_CODES } = require('../../common/constants')

const RolMiddleWare = function (rolService) {
  const compare = (pathOrigin, pathBd) => {
    if (pathOrigin.length !== pathBd.length) return false
    let flag = true
    for (const index in pathOrigin)
      flag = pathOrigin[index] === pathBd[index] || pathBd[index] === '@id'
    return flag
  }
  const verificar = () => {
    return async function _middleware(req, res, next) {
      try {
        const { method, baseUrl, user: { permissions, ip }, hostname } = req
        const path = baseUrl.split('/')
        if (ip !== hostname) return error(res, HTTP_CODES.UNAUTHORIZED, 'Server no autorizado para realizar esta acción')
        if (!permissions || !permissions[method]) return error(res, HTTP_CODES.UNAUTHORIZED, 'Server no autorizado para realizar esta acción')
        for (const ruta of permissions[method]) {
          const pathPermission = ruta.split('/')
          if (compare(path, pathPermission)) return next()
        }
        error(res, HTTP_CODES.UNAUTHORIZED, 'Server no autorizado para realizar esta acción')
      } catch (err) {
        console.log(err)
        error(res, HTTP_CODES.UNAUTHORIZED, err.message)
      }
    }
  }
  return {
    verificar
  }
}

module.exports = ({ services: { rol } }) => {
  return new RolMiddleWare(rol)
}