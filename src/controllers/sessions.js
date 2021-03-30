import { usersItem } from '@/helpers/users';
import {
  sessionsGetTokenByUserId,
  sessionsCreate,
  sessionsVerify,
  sessionsDecode,
  sessionsWipe,
} from '@/helpers/sessions';

/**
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.userPIN
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: string
 * }>}
 * */
export async function sessionsGetToken(params) {
  const {
    userId,
    userPIN,
  } = params;
  const userResult = await usersItem({ id: userId });
  if (!userResult.ok) {
    return {
      ok: false,
      reason: 'Unknown user',
      data: '',
    };
  }
  const user = userResult.data;
  if (user.pin !== userPIN) {
    return {
      ok: false,
      reason: 'Wrong user',
      data: '',
    };
  }
  sessionsWipe({ userId });
  const result = await sessionsCreate({
    user: {
      id: userId,
      name: user.name,
      avatarURL: user.avatarURL,
    },
    secret: user.pin.toString(),
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: '',
    };
  }
  return {
    ok: true,
    reason: '',
    data: result.data,
  };
}

/**
 * @param {Object} params
 * @param {string} params.token
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|UsersItemFull
 * }>}
 * */
export async function sessionsGetUser(params) {
  const { token } = params;
  const jwtUser = sessionsDecode({ token });
  if (!jwtUser.ok) {
    return {
      ok: false,
      reason: 'Unknown token',
      data: null,
    };
  }
  const userId = jwtUser.data.id;
  const existingToken = sessionsGetTokenByUserId(userId);
  if (token !== existingToken) {
    return {
      ok: false,
      reason: 'Wrong session',
      data: null,
    };
  }
  const userResult = await usersItem({ id: userId });
  if (!userResult.ok) {
    return {
      ok: false,
      reason: 'Unknown user',
      data: null,
    };
  }
  const user = userResult.data;
  const result = await sessionsVerify({
    token,
    secret: user.pin.toString(),
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: null,
    };
  }
  return {
    ok: true,
    reason: '',
    data: {
      id: userId,
      name: user.name,
      avatarURL: user.avatarURL,
      pin: user.pin,
    },
  };
}
