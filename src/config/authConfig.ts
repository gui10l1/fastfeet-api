export default {
  secret: process.env.APP_SECRET || 'default-for-jest',
  expiresIn: '1d',
};
