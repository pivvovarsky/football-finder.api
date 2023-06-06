/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import firebase from "firebase-admin";
import { FirebaseService } from "./firebase.service";

@Injectable()
export class FirebaseStorageService {
  storage: firebase.storage.Storage;

  constructor(firebaseService: FirebaseService) {
    this.storage = firebaseService.getFirebaseStorage();
  }

  public async() {}
}
