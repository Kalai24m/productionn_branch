import awsServerlessExpress from 'aws-serverless-express';
import app from './index.js';
export const handler = (event, context) => {
  const server = awsServerlessExpress.createServer(app);
  awsServerlessExpress.proxy(server, event, context);
};