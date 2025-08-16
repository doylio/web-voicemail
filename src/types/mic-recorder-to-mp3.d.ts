declare module "mic-recorder-to-mp3" {
  interface MicRecorderOptions {
    bitRate?: number;
  }

  interface RecorderChain {
    getMp3(): Promise<[ArrayBuffer[], Blob]>;
  }

  export default class MicRecorder {
    constructor(options?: MicRecorderOptions);
    start(): Promise<void>;
    stop(): RecorderChain;
  }
}
