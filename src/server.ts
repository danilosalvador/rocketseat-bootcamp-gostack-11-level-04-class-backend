import express from 'express';
import routes from './routes';

const app = express();

app.use(routes);
app.use(express.json());

app.listen(3333, () => {
  console.log('Server starded on port 3333 🚀');
});
