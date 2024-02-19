const { error, ok } = require('../../../common/response')
const { HTTP_CODES } = require('../../../common/constants')

module.exports = ({ libs: { jwt } }) => {
  const generate = async ({ body, hostname }, res) => {
    try {
      const result = jwt.getToken(process.env.JWT_TIMER_MIN, body)
      return ok(res, true, 'ok', { token: result, host: hostname })
    } catch (err) {
      error(res, HTTP_CODES.BAD_REQUEST, err.message)
    }
  }
  
  return { generate }
}