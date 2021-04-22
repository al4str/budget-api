import { sessionsMiddleware } from '@/middlewares/sessions';
import {
  budgetObtainAverageValues,
  budgetObtainFixedValues,
  budgetUpdateFixedValues,
} from '@/controllers/budget';

export function budgetRouter(app) {
  app.get('/budget/average', sessionsMiddleware(), async (req, res) => {
    const result = await budgetObtainAverageValues();
    res.json(result);
  });

  app.get('/budget/fixed', sessionsMiddleware(), async (req, res) => {
    const result = await budgetObtainFixedValues();
    res.json(result);
  });

  app.put('/budget/fixed', sessionsMiddleware(), async (req, res) => {
    const result = await budgetUpdateFixedValues(req.body, req.user);
    res.json(result);
  });
}
