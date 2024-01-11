// import awsServerlessExpress from 'aws-serverless-express';
// import app from './index.js';
// export const handler = (event, context) => {
//   const server = awsServerlessExpress.createServer(app);
//   awsServerlessExpress.proxy(server, event, context);
// };

import serverlessExpress from '@codegenie/serverless-express';
import app from './index.js';

export const handler = async (event, context) => {
  const result = await serverlessExpress({ app })(event, context);
  return result;
};