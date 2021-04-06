import { resourceRouterCreate } from '@/helpers/resourceRouter';
import { resourceControllerCreate } from '@/helpers/resourceController';
import { expendituresOperations } from '@/helpers/expenditures';

const controller = resourceControllerCreate({
  operations: expendituresOperations,
})

const router = resourceRouterCreate({
  resource: 'EXPENDITURES',
  controller,
});

export const expendituresRouter = router;
