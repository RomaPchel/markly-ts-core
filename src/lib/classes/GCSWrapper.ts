import { Storage } from "@google-cloud/storage";

export class GCSWrapper {
  private static instance: GCSWrapper;
  private storage: Storage;
  private bucketName: string;

  private constructor(bucketName: string) {
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  public static getInstance(bucketName: string): GCSWrapper {
    if (!GCSWrapper.instance) {
      GCSWrapper.instance = new GCSWrapper(bucketName);
    }
    return GCSWrapper.instance;
  }

  public async uploadBuffer(
    buffer: Buffer,
    destination: string,
    contentType = "application/octet-stream",
    makePublic = false,
    generateSignedUrl = false,
    signedUrlExpiresInSeconds = 3600,
  ): Promise<string> {
    const file = this.storage.bucket(this.bucketName).file(destination);

    await file.save(buffer, {
      contentType,
      resumable: false,
    });

    if (makePublic) {
      await file.makePublic();
      return `https://storage.googleapis.com/${this.bucketName}/${destination}`;
    }

    if (generateSignedUrl) {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + signedUrlExpiresInSeconds * 1000,
      });
      return url;
    }

    return `gs://${this.bucketName}/${destination}`;
  }

  public async deleteFile(destination: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(destination).delete();
  }

  public async fileExists(destination: string): Promise<boolean> {
    const [exists] = await this.storage
      .bucket(this.bucketName)
      .file(destination)
      .exists();
    return exists;
  }

    public async getReport(publicUrlOrPath: string) {
        const pathMatch = publicUrlOrPath.match(/\/([^/]+\/[^/?]+)/);
        const filePathInBucket = pathMatch ? decodeURIComponent(pathMatch[1]) : publicUrlOrPath;

        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(filePathInBucket);

        const [fileBuffer] = await file.download();
        return fileBuffer.toString('base64');
    }
}
