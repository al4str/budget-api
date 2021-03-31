import { genericControllers } from '@/helpers/genericControllers';
import {
  expensesCreate,
  expensesRead,
  expensesUpdate,
  expensesDelete,
  expensesList,
  expensesExists,
  expensesValidateCreate,
  expensesValidateUpdate,
  expensesMapPublic,
} from '@/helpers/expenses';
import { sessionsMiddleware } from '@/middlewares/sessions';

const {
  getItem,
  getList,
  createItem,
  updateItem,
  deleteItem,
} = genericControllers({
  onPublicItemMap: expensesMapPublic,
  onCreateValidate: expensesValidateCreate,
  onUpdateValidate: expensesValidateUpdate,
  onItemExist: expensesExists,
  onItemGet: expensesRead,
  onListGet: expensesList,
  onItemCreate: expensesCreate,
  onItemUpdate: expensesUpdate,
  onItemDelete: expensesDelete,
});

export function expensesRouter(app) {
  app.post('/expenses', sessionsMiddleware(), async (req, res) => {
    const result = await createItem(req.body, req.user);
    res.json(result);
  });

  app.get('/expenses', sessionsMiddleware(), async (req, res) => {
    const result = await getList();
    res.json(result);
  });

  app.get('/expenses/:id', sessionsMiddleware(), async (req, res) => {
    const result = await getItem(req.params.id);
    res.json(result);
  });

  app.patch('/expenses/:id', sessionsMiddleware(), async (req, res) => {
    const result = await updateItem(req.params.id, req.body, req.user);
    res.json(result);
  });

  app.delete('/expenses/:id', sessionsMiddleware(), async (req, res) => {
    const result = await deleteItem(req.params.id, req.user);
    res.json(result);
  });
}
