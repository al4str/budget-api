import { resourceRouterCreate } from '@/helpers/resourceRouter';
import { resourceControllerCreate } from '@/helpers/resourceController';
import { commoditiesOperations } from '@/helpers/commodities';

const controller = resourceControllerCreate({
  operations: commoditiesOperations,
})

const router = resourceRouterCreate({
  resource: 'COMMODITIES',
  controller,
});

export const commoditiesRouter = router;
