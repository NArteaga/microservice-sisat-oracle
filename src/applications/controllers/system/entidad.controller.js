const { error, ok } = require('../../../common/response')
const { HTTP_CODES } = require('../../../common/constants')

module.exports = ({ services: { entidad } }) => {
  const findAll = async ({}, res) => {
    try {
      const result = await entidad.findAll()
      return ok(res, true, 'ok', result)
    } catch (err) {
      error(res, HTTP_CODES.BAD_REQUEST, err.message)
    }
  }

  return { findAll }
}