import { resourceRouterCreate } from '@/helpers/resourceRouter';
import { resourceControllerCreate } from '@/helpers/resourceController';
import { transactionsOperations } from '@/helpers/transactions';

const controller = resourceControllerCreate({
  operations: transactionsOperations,
})

const router = resourceRouterCreate({
  resource: 'TRANSACTIONS',
  controller,
});

export const transactionsRouter = router;
