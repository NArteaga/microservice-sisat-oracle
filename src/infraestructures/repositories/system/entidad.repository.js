module.exports = ({ execute }) => {
  const findAll = async (transaction) => {
    const query = `
      SELECT ENTIDAD.DIM_ENTIDAD_PK
        ,ENTIDAD.COD_ACCESO
        ,ENTIDAD_GER.DESC_ENTIDAD as "nombre"
        ,ENTIDAD_GER.COD_INSTITUCION_FNDR as "codigoFNDR"
        ,ENTIDAD_GER.COD_ENTIDAD as "codigoSIGEP"
        ,ENTIDAD_GER.SIGLA_ENTIDAD as "sigla"
        ,'ACTIVO' as "estado"
      FROM SISAT.ATC_ENTIDAD ENTIDAD
      INNER JOIN GERFNDR.DIM_ENTIDAD ENTIDAD_GER ON ENTIDAD_GER.DIM_ENTIDAD_PK = ENTIDAD.DIM_ENTIDAD_PK
    `;
    return await execute(query, [], {}, transaction)
  }

  return { findAll }
}