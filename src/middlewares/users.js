import { sessionsMiddleware } from '@/middlewares/sessions';
import { usersUpdateItem } from '@/controllers/users';

export function usersRouter(app) {
  app.patch('/users/:id', sessionsMiddleware(), async (req, res) => {
    const result = await usersUpdateItem(req.params.id, req.body, req.user);
    res.json(result);
  });
}
