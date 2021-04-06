import 'source-map-support/register';
import util from 'util';
import path from 'path';
import https from 'https'
import fs from 'fs/promises';
import consola from 'consola';
import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { DIR_ROOT, HOST, PORT } from '@/constants';
import { scaffold } from '@/helpers/scaffold';
import { jsonMiddleware } from '@/middlewares/json';
import { sessionsRouter } from '@/middlewares/sessions';
import { usersRouter } from '@/middlewares/users';
import { categoriesRouter } from '@/middlewares/categories';
import { commoditiesRouter } from '@/middlewares/commodities';
import { incomeRouter } from '@/middlewares/income';
import { expensesRouter } from '@/middlewares/expenses';
import { expendituresRouter } from '@/middlewares/expenditures';

const console = consola.withTag('app');
const app = new App({
  settings: {
    networkExtensions: true
  },
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

app.use(cors({
  origin: '*',
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
incomeRouter(app);
expensesRouter(app);
expendituresRouter(app);

(async function() {
  await scaffold();
  const [
    certificate,
    privateKey,
  ] = await Promise.all([
    fs.readFile(path.join(DIR_ROOT, 'ssl', 'local.fin.al4str.dev.pem')),
    fs.readFile(path.join(DIR_ROOT, 'ssl', 'local.fin.al4str.dev-key.pem')),
  ]);
  const serverOptions = {
    key: privateKey,
    cert: certificate,
  };
  const server = https.createServer(serverOptions)
  server
    .on('request', app.attach)
    .listen(PORT, HOST, () => console.success(`https://${HOST}:${PORT}`));
}());
