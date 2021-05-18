interface IMailConfig {
  mailProvider: 'sandbox';
  from: {
    emailAddress: string;
    name: string;
  };
}

export default {
  mailProvider: process.env.MAIL_PROVIDER,
  from: {
    emailAddress: 'fastfeet@support.com',
    name: 'FastFeet Support',
  },
} as IMailConfig;
