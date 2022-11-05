import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import readRouter from './routes/unsigned';
import signedRouter from './routes/signed';
import { makeSubscriptionServer } from './subscriptions';
import { startPolling } from './subscriptions/polling';

dotenv.config();

const app: Express = express();
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.use('/v1/unsigned', readRouter);
app.use('/v1/signed', signedRouter);

makeSubscriptionServer(app)
  .then((server) => {
    startPolling();
    server.listen(port, () => {
      console.log(`Rest server is now running on http://localhost:${port}`);
      console.log(
        `Graphql Subscription server is now running on http://localhost:${port}/graphql`
      );
    });
  })
  .catch((error) => {
    console.error(error);
  });
