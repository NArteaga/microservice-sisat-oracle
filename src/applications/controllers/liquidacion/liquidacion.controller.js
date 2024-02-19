const { error, ok } = require('../../../common/response')
const { HTTP_CODES } = require('../../../common/constants')

module.exports = ({ services: { liquidacion } }) => {
  const generate = async ({ body }, res) => {
    try {
      const result = await liquidacion.generate(body)
      return ok(res, true, 'ok', result)
    } catch (err) {
      error(res, HTTP_CODES.BAD_REQUEST, err.message)
    }
  }

  const findViewLiquidation = async ({}, res) => {
    try {
      const result = await liquidacion.findViewLiquidation()
      return ok(res, true, 'ok', result)
    } catch (err) {
      error(res, HTTP_CODES.BAD_REQUEST, err.message)
    }
  }
  
  return { generate, findViewLiquidation }
}