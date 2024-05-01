declare module "aria2" {
  import { EventEmitter } from "events";

  declare interface JSONRPCClientOptions {
    WebSocket?: unknown;
    fetch?: typeof fetch;
    secure?: boolean;
    host?: string;
    port?: number;
    path?: string;
  }

  declare class JSONRPCClient extends EventEmitter {
    constructor(options: JSONRPCClientOptions);

    id(): number;
    url(protocol: string): string;
    websocket(message: any): Promise<void>;
    http(message: any): Promise<Response>;
    batch(calls: [string, any?][]): Promise<any[]>;
    call(method: string, parameters?: any): Promise<any>;
    open(): Promise<void>;
    close(): Promise<void>;
  }

  type Options = Record<string, string>;

  type StatusProperties =
    | "gid"
    | "status"
    | "totalLength"
    | "completedLength"
    | "uploadLength"
    | "bitfield"
    | "downloadSpeed"
    | "uploadSpeed"
    | "infoHash"
    | "numSeeders"
    | "seeder"
    | "pieceLength"
    | "numPieces"
    | "connections"
    | "errorCode"
    | "errorMessage"
    | "followedBy"
    | "following"
    | "belongsTo"
    | "dir"
    | "files"
    | "bittorrent"
    | "announceList"
    | "comment"
    | "creationDate"
    | "mode"
    | "info"
    | "name"
    | "verifiedLength"
    | "verifyIntegrityPending";

  export default class Aria2 extends JSONRPCClient {
    batch(calls: [string, ...any[]][]): Promise<any[]>;

    listNotifications(): Promise<string[]>;
    listMethods(): Promise<string[]>;

    call(
      method: "forceRemove" | "pause" | "unpause",
      gid: string,
    ): Promise<string>;
    call(
      method: "addUri",
      uris: string[],
      opts?: Options,
      position?: number,
    ): Promise<string>;

    call<T extends StatusProperties>(
      method: "tellStatus",
      gid: string,
      properties: T[],
    ): Promise<Record<T, unknown>>;
  }
}
