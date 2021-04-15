import { backupCreate } from '@/helpers/backup';
import { ERRORS } from '@/helpers/errors';

/**
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: string
 * }>}
 * */
export async function backupGetFilePath(byUser) {
  if (!byUser) {
    return {
      ok: false,
      reason: ERRORS.resourceUnknownUser,
      data: '',
    };
  }
  const result = await backupCreate();

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
