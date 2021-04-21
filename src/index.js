import 'source-map-support/register';
import util from 'util';
import consola from 'consola';
import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { IS_PRODUCTION, HOST, PORT } from '@/constants';
import { scaffold } from '@/helpers/scaffold';
import { jsonMiddleware } from '@/middlewares/json';
import { sessionsRouter } from '@/middlewares/sessions';
import { usersRouter } from '@/middlewares/users';
import { categoriesRouter } from '@/middlewares/categories';
import { commoditiesRouter } from '@/middlewares/commodities';
import { transactionsRouter } from '@/middlewares/transactions';
import { backupRouter } from '@/middlewares/backup';

const console = consola.withTag('app');

const app = new App({
  settings: {
    networkExtensions: true,
  },
  onError(err, req, res) {
    if (IS_PRODUCTION) {
      res.sendStatus(500);
      return;
    }
    res
      .status(500)
      .json(util.inspect(err, true));
  },
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(0);
});

app.use(cors({
  origin: 'budget.al4str.dev',
  allowedHeaders: ['Content-Type', 'X-Token'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
}));
app.use(jsonMiddleware());

app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});

sessionsRouter(app);
usersRouter(app);
categoriesRouter(app);
commoditiesRouter(app);
transactionsRouter(app);
backupRouter(app);

(async function() {
  await scaffold();
  app.listen(PORT, () => console.success(`http://${HOST}:${PORT}`), HOST);
}());
