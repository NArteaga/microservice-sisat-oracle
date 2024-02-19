module.exports = ({ repositories: { entidad } }) => {
  const findAll = async () => {
    try {
      return await entidad.findAll()
    } catch (error) {
      console.log(error)
      throw new Error('No se encontro la información solicitada')
    }
  }

  return { findAll }
}
