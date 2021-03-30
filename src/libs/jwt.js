import jwt from 'jsonwebtoken';

/**
 * @param {Object} params
 * @param {Object} params.payload
 * @param {string} params.secret
 * @return {Promise<string>}
 * */
export function jwtCreate(params) {
  return new Promise((resolve, reject) => {
    const { payload, secret } = params;
    jwt.sign(payload, secret, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  })
}

/**
 * @param {Object} params
 * @param {string} params.token
 * @param {string} params.secret
 * @return {Promise<Object>}
 * */
export function jwtVerify(params) {
  return new Promise((resolve, reject) => {
    const { token, secret } = params;
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(payload);
    });
  })
}

/**
 * @param {Object} params
 * @param {string} params.token
 * @return {Object}
 * */
export function jwtDecode(params) {
  const { token } = params;
  return jwt.decode(token);
}
