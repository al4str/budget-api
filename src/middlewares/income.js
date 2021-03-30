import { sessionsMiddleware } from '@/middlewares/sessions';
import {
  incomeGetItem,
  incomeGetList,
  incomeCreateItem,
  incomeUpdateItem,
  incomeDeleteItem,
} from '@/controllers/income';

export function incomeRouter(app) {
  app.post('/income', sessionsMiddleware(), async (req, res) => {
    const result = await incomeCreateItem(req.body, req.user);
    res.json(result);
  });

  app.get('/income', sessionsMiddleware(), async (req, res) => {
    const result = await incomeGetList();
    res.json(result);
  });

  app.get('/income/:id', sessionsMiddleware(), async (req, res) => {
    const result = await incomeGetItem(req.params.id);
    res.json(result);
  });

  app.patch('/income/:id', sessionsMiddleware(), async (req, res) => {
    const result = await incomeUpdateItem(req.params.id, req.body, req.user);
    res.json(result);
  });

  app.delete('/income/:id', sessionsMiddleware(), async (req, res) => {
    const result = await incomeDeleteItem(req.params.id, req.user);
    res.json(result);
  });
}
