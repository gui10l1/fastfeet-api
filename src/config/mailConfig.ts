interface IMailConfig {
  mailProvider: 'sandbox';
}

export default {
  mailProvider: process.env.MAIL_PROVIDER,
} as IMailConfig;
