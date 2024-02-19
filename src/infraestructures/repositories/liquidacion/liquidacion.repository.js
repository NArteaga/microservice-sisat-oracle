module.exports = ({ execute }) => {
  const borrarLiquidacion = async (fechaInicio, fechaFin, codigoPrestamo, transaction) => {
    const query = `
      DECLARE
        var_RetVal          BINARY_INTEGER;
        var_PFECHAINICIAL   DATE;
        var_PFECHAFINAL     DATE;
        var_PPRESTAMO       NUMBER;
      BEGIN
        var_PFECHAINICIAL := TO_DATE('${fechaInicio}', 'DD/MM/YYYY');
        var_PFECHAFINAL := TO_DATE('${fechaFin}', 'DD/MM/YYYY');
        var_PPRESTAMO := ${codigoPrestamo};
        var_RetVal := SACDESK.SAC_LIQUIDACION.BORRALIQPRES (
          PFECHAINICIAL   => var_PFECHAINICIAL,
          PFECHAFINAL     => var_PFECHAFINAL,
          PPRESTAMO       => var_PPRESTAMO
        );
      END;
    `;
    return await execute(query, [], {}, transaction)
  }

  const generarLiquidacion = async (fechaInicio, fechaFin, codigoPrestamo, transaction) => {
    const query = `
      DECLARE
        var_RetVal          BINARY_INTEGER;
        var_PFECHAINICIAL   DATE;
        var_PFECHAFINAL     DATE;
        var_PPRESTAMO       NUMBER;
      BEGIN
        var_PFECHAINICIAL := TO_DATE('${fechaInicio}', 'DD/MM/YYYY');
        var_PFECHAFINAL := TO_DATE('${fechaFin}', 'DD/MM/YYYY');
        var_PPRESTAMO := ${codigoPrestamo};
        var_RetVal := SACDESK.SAC_LIQUIDACION.GENERALIQUIDACIONES (
          PFECHAINICIAL   => var_PFECHAINICIAL,
          PFECHAFINAL     => var_PFECHAFINAL,
          PPRESTAMO       => var_PPRESTAMO
        );
      END;
    `;
    return await execute(query, [], {}, transaction)
  }

  const findAll = async (fechaInicio, fechaFin, codigoPrestamo, transaction) => {
    const query = `
      SELECT *
      FROM SACDESK.SAC_LIQ_PRES
      WHERE PK_SAC_PRESTAMO LIKE '${codigoPrestamo}'
        AND LQPR_F_LIQ BETWEEN TO_DATE('${fechaInicio}', 'DD/MM/YYYY') AND TO_DATE('${fechaFin}', 'DD/MM/YYYY')
    `
    return await execute(query, [], {}, transaction)
  }

  const findAllDetail = async (fechaInicio, fechaFin, codigoPrestamo, transaction) => {
    const query = `
      SELECT DETAIL.*
      FROM SACDESK.SAC_LIQ_PRES_DET  DETAIL
        INNER JOIN SACDESK.SAC_LIQ_PRES LIQ_PRES ON (DETAIL.PK_LIQ_PRES = LIQ_PRES.PK_LIQ_PRES)
      WHERE LIQ_PRES.PK_SAC_PRESTAMO LIKE '${codigoPrestamo}'
        AND LIQ_PRES.LQPR_F_LIQ BETWEEN TO_DATE('${fechaInicio}', 'DD/MM/YYYY') AND TO_DATE('${fechaFin}', 'DD/MM/YYYY')
    `
    return await execute(query, [], {}, transaction)
  }

  const findAllReportPay = async (fechaInicio, fechaFin, codigoPrestamo, transaction) => {
    const query = `
      SELECT DETAIL.*
      FROM SACDESK.SAC_LIQ_PLAN_PAGO  PAY
        INNER JOIN SACDESK.SAC_LIQ_PRES LIQ_PRES
          ON (
            PAY.PK_SAC_PRESTAMO = LIQ_PRES.PK_SAC_PRESTAMO
            AND PAY.PK_LIQ_PRES = LIQ_PRES.PK_LIQ_PRES
          )
      WHERE LIQ_PRES.PK_SAC_PRESTAMO LIKE '${codigoPrestamo}'
        AND LIQ_PRES.LQPR_F_LIQ BETWEEN TO_DATE('${fechaInicio}', 'DD/MM/YYYY') AND TO_DATE('${fechaFin}', 'DD/MM/YYYY')
    `
    return await execute(query, [], {}, transaction)
  }

  const findViewLiqPres = async (transaction) => {
    const query = `
      SELECT *
      FROM SACDESK.VL_LIQ_PRES
    `
    return await execute(query, [], {}, transaction)
  }

  return {
    borrarLiquidacion,
    generarLiquidacion,
    findAll,
    findAllDetail,
    findAllReportPay,
    findViewLiqPres
  }
}