import { sessionsMiddleware } from '@/middlewares/sessions';
import { backupGetFilePath } from '@/controllers/backup';

export function backupRouter(app) {
  app.get('/backup/latest', sessionsMiddleware(), async (req, res) => {
    const result = await backupGetFilePath(req.user);
    res.json(result);
  });
}
