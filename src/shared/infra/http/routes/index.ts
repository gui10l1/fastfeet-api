import { Router } from 'express';

const routes = Router();

routes.get('/', (_, res) => {
  res.send();
});

export default routes;
