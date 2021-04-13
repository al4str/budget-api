import { uploadParse, uploadDelete } from '@/libs/upload';
import { sessionsMiddleware } from '@/middlewares/sessions';
import {
  usersGetItem,
  usersGetList,
  usersUpdateItem,
  usersGetAvatar,
  usersUploadAvatar,
} from '@/controllers/users';

export function usersRouter(app) {
  app.get('/users/:id', sessionsMiddleware(), async (req, res) => {
    const result = await usersGetItem(req.params.id);
    res.json(result);
  });

  app.get('/users', sessionsMiddleware(), async (req, res) => {
    const result = await usersGetList();
    res.json(result);
  });

  app.patch('/users/:id', sessionsMiddleware(), async (req, res) => {
    const result = await usersUpdateItem(req.params.id, req.body, req.user);
    res.json(result);
  });

  app.get('/users/:id/avatar/:avatarId', async (req, res) => {
    const { id, avatarId } = req.params;
    const avatarPath = usersGetAvatar(id, avatarId);
    res.set('Cache-Control', 'public');
    res.set('Expires', '1y');
    res.sendFile(avatarPath);
  });

  app.post('/users/:id/avatar', sessionsMiddleware(), async (req, res) => {
    const uploadResult = await uploadParse(req);
    const file = uploadResult.data.file;
    if (!uploadResult.ok || !file) {
      if (file) {
        await uploadDelete(file);
      }
      res.json(uploadResult);
      return;
    }
    const result = await usersUploadAvatar(req.params.id, file, req.user);
    await uploadDelete(file);
    res.json(result);
  });
}
