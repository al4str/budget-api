import { sessionsMiddleware } from '@/middlewares/sessions';
import {
  commoditiesGetItem,
  commoditiesGetList,
  commoditiesCreateItem,
  commoditiesUpdateItem,
  commoditiesDeleteItem,
} from '@/controllers/commodities';

export function commoditiesRouter(app) {
  app.post('/commodities', sessionsMiddleware(), async (req, res) => {
    const result = await commoditiesCreateItem(req.body, req.user);
    res.json(result);
  });

  app.get('/commodities', sessionsMiddleware(), async (req, res) => {
    const result = await commoditiesGetList();
    res.json(result);
  });

  app.get('/commodities/:id', sessionsMiddleware(), async (req, res) => {
    const result = await commoditiesGetItem(req.params.id);
    res.json(result);
  });

  app.patch('/commodities/:id', sessionsMiddleware(), async (req, res) => {
    const result = await commoditiesUpdateItem(req.params.id, req.body, req.user);
    res.json(result);
  });

  app.delete('/commodities/:id', sessionsMiddleware(), async (req, res) => {
    const result = await commoditiesDeleteItem(req.params.id, req.user);
    res.json(result);
  });
}
