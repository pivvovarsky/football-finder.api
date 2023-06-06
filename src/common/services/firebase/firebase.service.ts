/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import firebase from "firebase-admin";
import { ApiConfigService } from "../api-config.service";

@Injectable()
export class FirebaseService {
  app: firebase.app.App;
  auth: firebase.auth.Auth;
  storage: firebase.storage.Storage;

  constructor(private config: ApiConfigService) {
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(config.firebase.config),
      storageBucket: config.firebase.storageBucket,
    });
    this.auth = this.app.auth();
    this.storage = this.app.storage();
  }

  public getFirebaseAuth(): firebase.auth.Auth {
    return this.auth;
  }

  public getFirebaseStorage(): firebase.storage.Storage {
    return this.storage;
  }

  public async onModuleDestroy() {
    await this.app.delete();
  }
}
