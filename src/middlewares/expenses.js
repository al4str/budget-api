import { resourceRouterCreate } from '@/helpers/resourceRouter';
import { resourceControllerCreate } from '@/helpers/resourceController';
import { expensesOperations } from '@/helpers/expenses';

const controller = resourceControllerCreate({
  operations: expensesOperations,
})

const router = resourceRouterCreate({
  resource: 'EXPENSES',
  controller,
});

export const expensesRouter = router;
