import { Injectable, NotFoundException } from "@nestjs/common";
import firebase from "firebase-admin";
import { FirebaseService } from "./firebase.service";

@Injectable()
export class FirebaseStorageService {
  storage: firebase.storage.Storage;

  constructor(firebaseService: FirebaseService) {
    this.storage = firebaseService.getFirebaseStorage();
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    const storageRef = this.storage.bucket().file(`teams/images/${id}`);

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

  public async getImageUrl(id: string) {
    const storageRef = this.storage.bucket().file(`teams/images/${id}`);
    if (!storageRef) {
      throw new NotFoundException();
    }
    return await storageRef.get();
  }

  public async deleteImage(id: string) {
    const storageRef = this.storage.bucket().file(`teams/images/${id}`);

    return await storageRef.delete();
  }
}
