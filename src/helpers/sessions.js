import { jwtCreate, jwtVerify, jwtDecode } from '@/libs/jwt';
import { dbGetItem, dbCreate, dbWipe } from '@/libs/db';

/**
 * @param {string} id
 * @return {string}
 * */
export function sessionsGetTokenByUserId(id) {
  const item = dbGetItem({
    name: 'SESSIONS',
    id,
  });

  if (!item) {
    return '';
  }

  return item.data.token;
}

/**
 * @param {Object} params
 * @param {UsersItemPublic} params.user
 * @param {string} params.secret
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: string
 * }>}
 * */
export async function sessionsCreate(params) {
  try {
    const { user, secret } = params;
    const token = await jwtCreate({ payload: user, secret });
    dbCreate({
      name: 'SESSIONS',
      id: user.id,
      data: {
        token,
      },
      userId: user.id,
    });

    return {
      ok: true,
      reason: null,
      data: token,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: '',
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.token
 * @param {string} params.secret
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null
 * }>}
 * */
export async function sessionsVerify(params) {
  try {
    const { token, secret } = params;
    await jwtVerify({ token, secret });

    return {
      ok: true,
      reason: null,
      data: null,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.token
 * @return {{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|UsersItemPublic
 * }}
 * */
export function sessionsDecode(params) {
  try {
    const { token } = params;
    const user = jwtDecode({ token });
    if (!user || !user.id) {
      return {
        ok: false,
        reason: new Error('Corrupted token'),
        data: null,
      };
    }

    return {
      ok: true,
      reason: null,
      data: user,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.userId
 * @return {void}
 * */
export function sessionsWipe(params) {
  const { userId } = params;
  try {
    dbWipe({
      name: 'SESSIONS',
      id: userId,
    });
  }
  catch (err) {
    //
  }
}
