import { DB_SEED_USER_ID, dbCreate } from '@/libs/db';

export const SEEDS_CATEGORY_SALARY = {
  id: 'salary',
  title: 'Зарплата',
  type: 'income',
};

export const SEEDS_CATEGORY_TIPS = {
  id: 'tips',
  title: 'Чаюха',
  type: 'income',
};

export const SEEDS_CATEGORY_TINKOFF_INCOME = {
  id: 'tinkoff-income',
  title: 'Тинькофф',
  type: 'income',
};

export const SEEDS_CATEGORY_DEBTS_INCOME = {
  id: 'debts-income',
  title: 'Возврат долгов',
  type: 'income',
};

export const SEEDS_CATEGORY_DEBTS_COSTS = {
  id: 'debts-costs',
  title: 'В долг',
  type: 'costs',
};

export const SEEDS_CATEGORY_HEALTH = {
  id: 'health',
  title: 'Здоровье',
  type: 'costs',
};

export const SEEDS_CATEGORY_HOME = {
  id: 'home',
  title: 'Дом',
  type: 'costs',
};

export const SEEDS_CATEGORY_CLOTHES = {
  id: 'clothes',
  title: 'Одежда',
  type: 'costs',
};

export const SEEDS_CATEGORY_ANIMALS = {
  id: 'animals',
  title: 'Животинка',
  type: 'costs',
};

export const SEEDS_CATEGORY_FASTFOOD = {
  id: 'fastfood',
  title: 'Фастфуд',
  type: 'costs',
};

export const SEEDS_CATEGORY_ENTERTAINMENT = {
  id: 'entertainment',
  title: 'Развлечения',
  type: 'costs',
};

export const SEEDS_CATEGORY_EDUCATION = {
  id: 'education',
  title: 'Образование',
  type: 'costs',
};

export const SEEDS_CATEGORY_TRANSPORT = {
  id: 'transport',
  title: 'Транспорт',
  type: 'costs',
};

export const SEEDS_CATEGORY_COMMUNICATIONS = {
  id: 'communications',
  title: 'Связь',
  type: 'costs',
};

export const SEEDS_CATEGORY_MONEY_BOX = {
  id: 'money-box',
  title: 'Копилка',
  type: 'costs',
};

export const SEEDS_CATEGORY_GROCERY = {
  id: 'grocery',
  title: 'Продукты',
  type: 'costs',
};

export const SEEDS_CATEGORY_UNEXPECTED = {
  id: 'unexpected',
  title: 'Непредвиденное',
  type: 'costs',
};

const CATEGORIES = [
  SEEDS_CATEGORY_SALARY,
  SEEDS_CATEGORY_TIPS,
  SEEDS_CATEGORY_TINKOFF_INCOME,
  SEEDS_CATEGORY_DEBTS_INCOME,
  SEEDS_CATEGORY_DEBTS_COSTS,
  SEEDS_CATEGORY_HEALTH,
  SEEDS_CATEGORY_HOME,
  SEEDS_CATEGORY_CLOTHES,
  SEEDS_CATEGORY_ANIMALS,
  SEEDS_CATEGORY_FASTFOOD,
  SEEDS_CATEGORY_ENTERTAINMENT,
  SEEDS_CATEGORY_EDUCATION,
  SEEDS_CATEGORY_TRANSPORT,
  SEEDS_CATEGORY_COMMUNICATIONS,
  SEEDS_CATEGORY_MONEY_BOX,
  SEEDS_CATEGORY_GROCERY,
  SEEDS_CATEGORY_UNEXPECTED,
];

export function seedsCategoriesPlant() {
  CATEGORIES.forEach((item) => {
    dbCreate({
      name: 'CATEGORIES',
      id: item.id,
      data: {
        title: item.title,
        type: item.type,
      },
      userId: DB_SEED_USER_ID,
    });
  });
}

