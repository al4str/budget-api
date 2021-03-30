import { sessionsMiddleware } from '@/middlewares/sessions';
import {
  categoriesGetItem,
  categoriesGetList,
  categoriesCreateItem,
  categoriesUpdateItem,
  categoriesDeleteItem,
} from '@/controllers/categories';

export function categoriesRouter(app) {
  app.post('/categories', sessionsMiddleware(), async (req, res) => {
    const result = await categoriesCreateItem(req.body, req.user);
    res.json(result);
  });

  app.get('/categories', sessionsMiddleware(), async (req, res) => {
    const result = await categoriesGetList();
    res.json(result);
  });

  app.get('/categories/:id', sessionsMiddleware(), async (req, res) => {
    const result = await categoriesGetItem(req.params.id);
    res.json(result);
  });

  app.patch('/categories/:id', sessionsMiddleware(), async (req, res) => {
    const result = await categoriesUpdateItem(req.params.id, req.body, req.user);
    res.json(result);
  });

  app.delete('/categories/:id', sessionsMiddleware(), async (req, res) => {
    const result = await categoriesDeleteItem(req.params.id, req.user);
    res.json(result);
  });
}
