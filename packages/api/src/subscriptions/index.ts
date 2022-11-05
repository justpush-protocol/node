import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import { Express } from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import bodyParser from 'body-parser';
import cors from 'cors';
import { resolvers } from './resolvers';

const typeDefs = `#graphql
type Query {
  _dummy: String
}

type Subscription {
  notificationAdded(userId: String!): Notification
}

type Notification {
    id: String!
    timestamp: Int!
    data: NotificationData!
    group: Group
}

type  NotificationData {
  title: String,
  content: String,
  link: String,
}

type Group {
    id: String!
    name: String!
    owner: String!
    description: String
    image: String
    website: String
}
`;

export const makeSubscriptionServer = async (app: Express) => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/v1/graphql'
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }
    ]
  });

  await server.start();

  app.use(
    '/v1/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  );
  return httpServer;
};
