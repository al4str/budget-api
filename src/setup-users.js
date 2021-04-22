import readLine from 'readline';
import { DB_SEED_USER_ID, dbInit, dbUpdate } from '@/libs/db';

const lineReader = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

lineReader.question('Enter ID\n', (id) => {
  lineReader.question('Enter new PIN\n', (pin)  => {
    updateUserPIN(id, pin);
    lineReader.close();
  });
});

lineReader.on('close', () => {
  process.exit(0);
});

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
    updater(prevData) {
      return {
        ...prevData,
        pin: userPIN,
      };
    },
    userId: DB_SEED_USER_ID,
  });
}
