import { seedsUsersPlant } from '@/seeds/users';
import { seedsCategoriesPlant } from '@/seeds/categories';

export function seedsPlant() {
  seedsUsersPlant();
  seedsCategoriesPlant();
}
