import {
  usersExists,
  usersUpdate,
} from '@/helpers/users';

/**
 * @param {string} id
 * @param {Object} payload
 * @param {UsersItem} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|UsersItemPublic
 * }>}
 * */
export async function usersUpdateItem(id, payload, byUser) {
  if (!id || !payload) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: 'Unknown user',
      data: null,
    };
  }
  if (!await usersExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await usersUpdate({
    id: id,
    payload,
    byUserId: byUser.id,
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
      id: id,
      name: result.data.name,
      avatarURL: result.data.avatarURL,
    },
  };
}
