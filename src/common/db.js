const { config } = require('dotenv')
const oracledb = require('oracledb');
oracledb.autoCommit = false;
config()

const db = {
  user: process.env.DB_ORACLE_USER,
  password: process.env.DB_ORACLE_PASSWORD,
  connectString: `${process.env.DB_ORACLE_HOST}/${process.env.DB_ORACLE_DATABASE}`,
  logging: s => console.log(s)
}

const closeConnection = async (connection) => {
  if (connection)
    try { await connection.close() }
    catch (err) { throw new Error(err) }
}

const create = async (transaction) => {
  if (!transaction) return await oracledb.getConnection(db)
  return transaction
}

const commit = async (connection) => {
  try { await connection.commit() }
  catch (err) {
    throw new Error(err)
  } finally { await closeConnection(connection) }
}

const rollback = async (connection) => {
  try { await connection.rollback() }
  catch (err) { throw new Error(err) } finally { await closeConnection(connection) }
}

const execute = async (query, binds = [], options = {}, transaction) => {
  let connection;
  try {
    connection = await create(transaction)
    options.outFormat = oracledb.OBJECT
    await connection.execute("alter session set nls_date_format = 'DD/MM/YYYY'");
    return (await connection.execute(query, binds, options)).rows
  } catch (err) {
    console.log(err)
    if (!transaction) await rollback(connection)
    throw new Error(err)
  } finally { if (!transaction) await commit(connection) }
}

module.exports = {
  execute,
  transaction: { commit, rollback, create }
}