import { genericControllers } from '@/helpers/genericControllers';
import {
  expendituresCreate,
  expendituresRead,
  expendituresUpdate,
  expendituresDelete,
  expendituresList,
  expendituresExists,
  expendituresValidateCreate,
  expendituresValidateUpdate,
  expendituresMapPublic,
} from '@/helpers/expenditures';
import { sessionsMiddleware } from '@/middlewares/sessions';

const {
  getItem,
  getList,
  createItem,
  updateItem,
  deleteItem,
} = genericControllers({
  onPublicItemMap: expendituresMapPublic,
  onCreateValidate: expendituresValidateCreate,
  onUpdateValidate: expendituresValidateUpdate,
  onItemExist: expendituresExists,
  onItemGet: expendituresRead,
  onListGet: expendituresList,
  onItemCreate: expendituresCreate,
  onItemUpdate: expendituresUpdate,
  onItemDelete: expendituresDelete,
});

export function expendituresRouter(app) {
  app.post('/expenditures', sessionsMiddleware(), async (req, res) => {
    const result = await createItem(req.body, req.user);
    res.json(result);
  });

  app.get('/expenditures', sessionsMiddleware(), async (req, res) => {
    const result = await getList();
    res.json(result);
  });

  app.get('/expenditures/:id', sessionsMiddleware(), async (req, res) => {
    const result = await getItem(req.params.id);
    res.json(result);
  });

  app.patch('/expenditures/:id', sessionsMiddleware(), async (req, res) => {
    const result = await updateItem(req.params.id, req.body, req.user);
    res.json(result);
  });

  app.delete('/expenditures/:id', sessionsMiddleware(), async (req, res) => {
    const result = await deleteItem(req.params.id, req.user);
    res.json(result);
  });
}
