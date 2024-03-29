export interface IConfig {
  api: {
    port: number;
    prefix: string;
    version: string;
  };
  swagger: {
    title: string;
    version: string;
    description: string;
  };
  firebase: {
    config: {
      type: string;
      projectId: string;
      privateKeyId: string;
      privateKey: string;
      clientEmail: string;
      clientId: string;
      authUri: string;
      tokenUri: string;
      authProviderX509CertUrl: string;
      clientC509CertUrl: string;
    };
    storageBucket: string;
    key: string;
    loginUrl: string;
  };
  mailer: {
    transport: {
      service: string;
      host: string;
      port?: number;
      auth: {
        user: string;
        pass: string;
      };
    };
    defaults: {
      from: string;
    };
  };
  apiKey: string;
}
