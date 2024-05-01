export enum DownloadState {
  CheckingFiles = 1,
  DownloadingMetadata = 2,
  Downloading = 3,
  Finished = 4,
  Seeding = 5,
}

export interface DownloadProgress {
  bytesDownloaded: number;
  fileSize: number;
  progress: number;
  downloadSpeed: number;
  timeRemaining: number;
  status: DownloadState;
}

export interface DownloadBackend {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  startDownload: (gameId: number, downloadUrl: string) => void;
  stopDownload: (gameId: number) => void;
  pauseDownload: (gameId: number) => void;
  resumeDownload: (gameId: number) => void;
  getDownloadProgress: (gameId: number) => Promise<DownloadProgress>;
}
