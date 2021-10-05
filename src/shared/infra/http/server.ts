import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';

import '../websockets/server';

import app from './app';

app.use(cors());
app.listen(3333, () => {
  console.log('Server listening on port 3333');
});
