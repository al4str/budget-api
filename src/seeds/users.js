import { DB_SEED_USER_ID, dbCreate } from '@/libs/db';

export const SEEDS_USERS_AL4STR = {
  id: 'al4str',
  name: 'Нянто',
  avatarId: '',
  pin: 1234,
};

export const SEEDS_USERS_NAVA = {
  id: 'nava',
  name: 'Лися',
  avatarId: '',
  pin: 4321,
};

const USERS = [
  SEEDS_USERS_AL4STR,
  SEEDS_USERS_NAVA,
];

export function seedsUsersPlant() {
  USERS.forEach((item) => {
    dbCreate({
      name: 'USERS',
      id: item.id,
      data: {
        name: item.name,
        avatarId: item.avatarId,
        pin: item.pin,
      },
      userId: DB_SEED_USER_ID,
    });
  });
}
