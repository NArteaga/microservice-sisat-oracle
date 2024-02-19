const { sign, verify } = require('jsonwebtoken')

module.exports = () => {
  const getToken = (expire, data) => {
    return sign({ ...data, exp: exp(expire) }, process.env.JWT_SECRET)
  }

  const exp = (expire) => {
    return Math.floor(Date.now() / 1000) + (parseInt(expire) * 60)
  }

  const verifyToken = (token) =>
    verify(token, process.env.JWT_SECRET)
    
  return { getToken, verifyToken, exp }
}