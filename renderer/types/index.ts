export const encryptMethods = [
  "aes-128-gcm",
  "aes-192-gcm",
  "aes-256-gcm",
  "rc4-md5",
  "aes-128-cfb",
  "aes-192-cfb",
  "aes-256-cfb",
  "aes-128-ctr",
  "aes-192-ctr",
  "aes-256-ctr",
  "bf-cfb",
  "camellia-128-cfb",
  "camellia-192-cfb",
  "camellia-256-cfb",
  "chacha20-ietf-poly1305",
  "xchacha20-ietf-poly1305",
  "salsa20",
  "chacha20",
  "chacha20-ietf"
] as const;

export type Encryption = typeof encryptMethods[number];

export const plugins = ["v2ray-plugin", "kcptun"] as const;

export type Plugin = typeof plugins[number];

export type ACL = "bypass";

export interface Config {
  id: string;
  remark?: string;
  serverHost: string;
  serverPort: number;
  password: string;
  encryptMethod: Encryption;
  timeout?: number;
  acl?: ACL;
  fastOpen?: boolean;
  noDelay?: boolean;
  maxOpenFile?: number;
  udp?: boolean;
  plugin?: Plugin;
  pluginOpts?: string;
}

export type Mode = "PAC" | "Global" | "Manual";

export interface Settings {
  selectedServer?: string | null;
  mode: Mode;
  verbose: boolean;
  localPort: number;
  pacPort: number;
  gfwListUrl: string;
  autoLaunch: boolean;
}

export interface Status {
  connected: boolean;
}

export interface RootState {
  config: Config[];
  status: Status;
  settings: Settings;
}
