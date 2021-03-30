import 'source-map-support/register';
import util from 'util';
import consola from 'consola';
import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { scaffold } from '@/helpers/scaffold';
import { jsonMiddleware } from '@/middlewares/json';
import { sessionsRouter } from '@/middlewares/sessions';
import { usersRouter } from '@/middlewares/users';
import { categoriesRouter } from '@/middlewares/categories';
import { commoditiesRouter } from '@/middlewares/commodities';
import { incomeRouter } from '@/middlewares/income';

const host = '0.0.0.0';
const port = 3000;

const console = consola.withTag('app');
const app = new App({
  onError(err, req, res) {
    res
      .status(500)
      .json(util.inspect(err, true));
  },
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(0);
});

app.use(cors());
app.use(jsonMiddleware());

app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});

sessionsRouter(app);
usersRouter(app);
categoriesRouter(app);
commoditiesRouter(app);
incomeRouter(app);

(async function() {
  await scaffold();
  app.listen(port, () => {
    console.success(`"server" is available on http://${host}:${port}`);
  }, host);
}());
