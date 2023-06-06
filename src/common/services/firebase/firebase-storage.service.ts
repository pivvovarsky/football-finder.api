/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from "@nestjs/common";
import firebase from "firebase-admin";
import { FirebaseService } from "./firebase.service";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

@Injectable()
export class FirebaseStorageService {
  storage: firebase.storage.Storage;

  constructor(firebaseService: FirebaseService) {
    this.storage = firebaseService.getFirebaseStorage();
  }

  public async() {}
}
