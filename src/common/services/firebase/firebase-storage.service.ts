/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import firebase from "firebase-admin";
import { FirebaseService } from "./firebase.service";
import multer from "multer";

@Injectable()
export class FirebaseStorageService {
  storage: firebase.storage.Storage;

  constructor(firebaseService: FirebaseService) {
    this.storage = firebaseService.getFirebaseStorage();
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    const storageRef = this.storage.bucket().file(`teams/${id}/${file.originalname}`);

    await storageRef.save(file.buffer, {
      contentType: file.mimetype,
      resumable: false,
    });

    const imageUrl = await storageRef.getSignedUrl({
      action: "read",
      expires: "01-01-2030",
    });

    return imageUrl[0];
  }
}
