import {
  sessionsGetToken,
  sessionsGetUser,
} from '@/controllers/sessions';

export function sessionsMiddleware() {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {function(err: Error?): void} next
   * @return {Promise<void>}
   */
  async function middleware(req, res, next) {
    const token = req.get('X-Token');
    if (!token) {
      res.sendStatus(403);
      return;
    }
    const result = await sessionsGetUser({ token });
    if (!result.ok) {
      res.sendStatus(403);
      return;
    }
    req.user = result.data;
    next();
  }

  return middleware;
}

export function sessionsRouter(app) {
  app.post('/sessions/token/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userPIN = req.body.pin;
    const result = await sessionsGetToken({
      userId,
      userPIN,
    });
    res.json(result);
  });

  app.post('/sessions/validate', async (req, res) => {
    const token = req.body.token;
    if (!token) {
      res.sendStatus(400);
      return;
    }
    const result = await sessionsGetUser({ token });
    if (!result.ok) {
      res.sendStatus(403);
      return;
    }
    res.sendStatus(200);
  });
}
