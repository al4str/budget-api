export function jsonMiddleware() {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {function(err: Error?): void} next
   * @return {Promise<void>}
   */
  async function middleware(req, res, next) {
    const allowedMethod = [
      'post',
      'put',
      'patch',
      'delete',
    ].includes(req.method.toLowerCase());
    const allowedContentType = req.get('Content-Type') === 'application/json';
    if (allowedMethod && allowedContentType) {
      try {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }
        req.body = JSON.parse(body.toString());
      }
      catch (err) {
        next(err);
      }
    }
    next();
  }

  return middleware;
}
