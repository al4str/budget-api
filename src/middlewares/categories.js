import { resourceRouterCreate } from '@/helpers/resourceRouter';
import { resourceControllerCreate } from '@/helpers/resourceController';
import { categoriesOperations } from '@/helpers/categories';

const controller = resourceControllerCreate({
  operations: categoriesOperations,
})

const router = resourceRouterCreate({
  resource: 'CATEGORIES',
  controller,
});

export const categoriesRouter = router;
