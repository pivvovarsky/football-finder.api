import { IConfig } from "./config.interface";

export default (): IConfig => ({
  api: {
    //@ts-ignore
    port: parseInt(process.env.APP_PORT) || 8080,
    prefix: "api",
    version: "1",
  },
  swagger: {
    title: "Football Finder",
    description: "Football Finder - API - development",
    version: "1.0",
  },
  firebase: {
    //@ts-ignore
    config: JSON.parse(process.env.FIREBASE_CONFIG),
    storageBucket: process.env.FIREBASE_BUCKET ?? "",
    key: process.env.FIREBASE_KEY ?? "",
  },
  mailer: {
    transport: {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.MAILER_USER ?? "",
        pass: process.env.MAILER_PASS ?? "",
      },
    },
    defaults: {
      from: ` Fotball Finder "No-reply" `,
    },
  },
  apiKey: process.env.API_KEY || "",
});
