import path from 'path';
import fs from 'fs/promises';
import { DIR_AVATARS } from '@/constants';
import { idGet } from '@/libs/id';
import { resizeFile } from '@/libs/resize';
import { ERRORS } from '@/helpers/errors';
import {
  usersExists,
  usersItem,
  usersList,
  usersUpdate,
} from '@/helpers/users';

/**
 * @param {string} id
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|UsersItemPublic
 * }>}
 * */
export async function usersGetItem(id) {
  if (!id) {
    return {
      ok: false,
      reason: ERRORS.resourceInvalidParams,
      data: null,
    };
  }
  if (!await usersExists(id)) {
    return {
      ok: false,
      reason: ERRORS.resourceNotExist,
      data: null,
    };
  }
  const result = await usersItem({
    id: id,
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
      avatarId: result.data.avatarId,
    },
  };
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: Array<UsersItemPublic>
 * }>}
 * */
export async function usersGetList() {
  const result = await usersList();

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: [],
    };
  }
  return {
    ok: true,
    reason: '',
    data: result.data,
  };
}

/**
 * @param {string} id
 * @param {Object} payload
 * @param {string} payload.name
 * @param {UsersItemFull} byUser
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
      reason: ERRORS.resourceInvalidParams,
      data: null,
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: ERRORS.resourceUnknownUser,
      data: null,
    };
  }
  if (!await usersExists(id)) {
    return {
      ok: false,
      reason: ERRORS.resourceNotExist,
      data: null,
    };
  }
  const result = await usersUpdate({
    id: id,
    payload: {
      name: payload.name,
    },
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
      avatarId: result.data.avatarId,
    },
  };
}

/**
 * @param {string} id
 * @param {string} avatarId
 * @return {string}
 * */
export function usersGetAvatar(id, avatarId) {
  return path.resolve(DIR_AVATARS, `${id}.${avatarId}.jpeg`);
}

/**
 * @param {string} id
 * @param {UploadFile} file
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: string
 * }>}
 * */
export async function usersUploadAvatar(id, file, byUser) {
  if (!id || !file) {
    return {
      ok: false,
      reason: ERRORS.resourceInvalidParams,
      data: '',
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: ERRORS.resourceUnknownUser,
      data: '',
    };
  }
  const user = await usersItem({ id });
  if (!user.ok) {
    return {
      ok: false,
      reason: ERRORS.resourceNotExist,
      data: '',
    };
  }
  if (user.data.avatarId) {
    const prevAvatarPath = usersGetAvatar(id, user.data.avatarId);
    await fs.unlink(prevAvatarPath);
  }
  const avatarId = idGet();
  const resizeResult = await resizeFile({
    file,
    outPath: path.join(DIR_AVATARS, `${id}.${avatarId}.jpeg`),
    width: 96 * 2,
    height: 96 * 2,
  });
  if (!resizeResult.ok) {
    return {
      ok: false,
      reason: resizeResult.reason.toString(),
      data: '',
    };
  }
  const result = await usersUpdate({
    id: id,
    payload: {
      avatarId: avatarId,
    },
    byUserId: byUser.id,
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
    data: result.data.avatarId,
  };
}
