module.exports = ({ repositories: { liquidacion }, transaction: { create, commit, rollback } }) => {
  const generate = async ({ fechaInicio, fechaFin, codigoPrestamo }) => {
    let transaction
    try {
      transaction = await create()
      const result = { liquidations: [], details: [], reportPays: [] }
      await liquidacion.borrarLiquidacion(fechaInicio, fechaFin, codigoPrestamo, transaction)
      await liquidacion.generarLiquidacion(fechaInicio, fechaFin, codigoPrestamo, transaction)
      result.liquidations = await liquidacion.findAll(fechaInicio, fechaFin, codigoPrestamo, transaction)
      result.details = await liquidacion.findAllDetail(fechaInicio, fechaFin, codigoPrestamo, transaction)
      result.reportPays = await liquidacion.findAllReportPay(fechaInicio, fechaFin, codigoPrestamo, transaction)
      await commit(transaction)
      return result
    } catch (error) {
      await rollback(transaction)
      throw new Error('No se pudo generar la liquidación')
    }
  }

  const findViewLiquidation = async () => {
    try {
      return await liquidacion.findViewLiqPres()
    } catch (error) {
      throw new Error('No se encontro la información solicitada')
    }
  }

  return { generate, findViewLiquidation }
}
