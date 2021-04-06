import { resourceRouterCreate } from '@/helpers/resourceRouter';
import { resourceControllerCreate } from '@/helpers/resourceController';
import { incomeOperations } from '@/helpers/income';

const controller = resourceControllerCreate({
  operations: incomeOperations,
})

const router = resourceRouterCreate({
  resource: 'INCOME',
  controller,
});

export const incomeRouter = router;
