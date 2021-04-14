import { DB_SEED_USER_ID, dbInit, dbUpdate } from '@/libs/db';

/**
 * @param {string} userId
 * @param {string} userPIN
 * @return {void}
 * */
function updateUserPIN(userId, userPIN) {
  dbInit();
  dbUpdate({
    name: 'USERS',
    id: userId,
    updater(prevItem) {
      return {
        ...prevItem,
        data: {
          ...prevItem.data,
          pin: userPIN,
        },
      }
    },
    userId: DB_SEED_USER_ID,
  });
}

const [userId, userPIN] = process.argv.slice(2);

updateUserPIN(userId, userPIN);
