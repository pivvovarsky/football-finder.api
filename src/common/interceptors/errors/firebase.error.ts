export class FirebaseError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
