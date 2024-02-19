const { HTTP_CODES } = require('../../common/constants')
const { error } = require('../../common/response')

const JWTMiddleWare = function (jwt) {
  const verificar = () => {
    return async function _middleware(req, res, next) {
      try {
        if (!req.headers.authorization) throw new Error('No autorizado')
        const token = req.headers.authorization.replace('Bearer ', '')
        if (token.exp) delete token.exp
        if (token.iat) delete token.iat
        const user = await jwt.verifyToken(token)
        req.user = user
        next()
      } catch (err) {
        error(res, HTTP_CODES.UNAUTHORIZED, err.message)
      }
    }
  }

  return {
    verificar
  }
}

module.exports = ({ libs: { jwt } }) => {
  return new JWTMiddleWare(jwt)
}