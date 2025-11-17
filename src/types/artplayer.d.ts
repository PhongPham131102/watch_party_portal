/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
declare module "artplayer" {
  export default class Artplayer {
    constructor(options: any);
    static providers?: any;
    hls?: any;
    plugins?: Record<string, any>;
    subtitle: any;
    notice: any;
    controls: any;
    on(event: string, callback: (...args: any[]) => void): void;
    once(event: string, callback: (...args: any[]) => void): void;
    destroy(remove?: boolean): void;
    backward?: number;
    forward?: number;
  }
}

declare module "artplayer-plugin-hls-control" {
  const plugin: (options?: any) => any;
  export default plugin;
}

declare module "artplayer-plugin-multiple-subtitles" {
  const plugin: (options?: any) => any;
  export default plugin;
}
