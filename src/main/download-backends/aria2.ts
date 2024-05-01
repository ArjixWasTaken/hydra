import { DownloadBackend } from "./types";
import Aria2 from "aria2";

export class Aria2Backend implements DownloadBackend {
  aria2?: Aria2;

  async connect() {
    this.aria2 = new Aria2({
      host: "localhost",
      port: 6969,
      secure: false,
      fetch: fetch,
    });
  }

  async disconnect() {
    delete this.aria2;
  }

  async startDownload(gameId: number, downloadUrl: string) {
    await this.aria2?.call("addUri", [downloadUrl], {
      gid: this.intToGid(gameId),
    });
  }

  async stopDownload(gameId: number) {
    await this.aria2?.call("forceRemove", this.intToGid(gameId));
  }

  async pauseDownload(gameId: number) {
    await this.aria2?.call("pause", this.intToGid(gameId));
  }

  async resumeDownload(gameId: number) {
    await this.aria2?.call("unpause", this.intToGid(gameId));
  }

  async getDownloadProgress(gameId: number) {
    let progress = await this.aria2?.call("tellStatus", this.intToGid(gameId), [
      "completedLength",
      "totalLength",
      "downloadSpeed",
      "status",
      "followedBy",
    ]);

    if (Array.isArray(progress?.followedBy)) {
      progress = await this.aria2?.call("tellStatus", progress.followedBy[0], [
        "completedLength",
        "totalLength",
        "downloadSpeed",
        "status",
        "followedBy",
      ]);
    }

    if (!progress) {
      throw new Error("Download not found");
    }

    // prettier-ignore
    return {
      bytesDownloaded: progress.completedLength as number,
      fileSize: progress.totalLength as number,
      progress: (<number>progress.completedLength / <number>progress.totalLength) * 100,
      downloadSpeed: progress.downloadSpeed as number,
      timeRemaining: 0,
      status: 3,
    };
  }

  private intToGid(int: number): string {
    const hex = int.toString(16).toLowerCase();
    const pad = "0".repeat(16 - hex.length);
    return pad + hex;
  }
}
