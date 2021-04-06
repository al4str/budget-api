import { sessionsMiddleware } from '@/middlewares/sessions';

/**
 * @typedef {import('@tinyhttp/app').App} App
 * */

/**
 * @param {Object} params
 * @param {DBName} params.resource
 * @param {{
 *   list: function(): Promise
 *   read: function(string): Promise
 *   create: function(Object, UsersItemFull): Promise
 *   update: function(string, Object, UsersItemFull): Promise
 *   remove: function(string, UsersItemFull): Promise
 *   exist: function(string): Promise
 * }} params.controller
 * @return {function(App): void}
 * */
export function resourceRouterCreate(params) {
  const { resource, controller } = params;
  const resourcePath = resource.toLowerCase();

  /**
   * @param {App} app
   * @return {void}
   * */
  function router(app) {
    app.get(`/${resourcePath}`, sessionsMiddleware(), async (req, res) => {
      const result = await controller.list();
      res.json(result);
    });

    app.get(`/${resourcePath}/:id`, sessionsMiddleware(), async (req, res) => {
      const result = await controller.read(req.params.id);
      res.json(result);
    });

    app.post(`/${resourcePath}`, sessionsMiddleware(), async (req, res) => {
      const result = await controller.create(req.body, req.user);
      res.json(result);
    });

    app.patch(`/${resourcePath}/:id`, sessionsMiddleware(), async (req, res) => {
      const result = await controller.update(req.params.id, req.body, req.user);
      res.json(result);
    });

    app.delete(`/${resourcePath}/:id`, sessionsMiddleware(), async (req, res) => {
      const result = await controller.remove(req.params.id, req.user);
      res.json(result);
    });

    app.get(`/${resourcePath}/:id/exist`, async (req, res) => {
      const result = await controller.exist(req.params.id);
      res.json(result);
    });
  }

  return router;
}
