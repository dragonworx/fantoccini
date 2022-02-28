// TODO: refactor to use requestAnimationFrame

export class Ticker {
  private fps: number;
  private startTime: number = -1;
  private msPerFrame: number = 0;
  private timeoutId?: number;
  private expectedNextFrameTime: number = 0;

  isRunning: boolean = false;
  frame: number = 0;

  constructor(readonly target: { onTick: () => boolean | void }, fps: number) {
    this.fps = fps;
    this.msPerFrame = 1000 / this.fps;
  }

  private tick = () => {
    const { expectedNextFrameTime, msPerFrame } = this;
    const now = Date.now();
    const quantiseOffset = now - expectedNextFrameTime;
    const adjustedMsPerFrame = msPerFrame - quantiseOffset;
    this.expectedNextFrameTime = now + adjustedMsPerFrame;
    const shouldStop = this.target.onTick();
    if (shouldStop === true) {
      return;
    } else {
      this.frame++;
      this.timeoutId = window.setTimeout(this.tick, adjustedMsPerFrame);
    }
  };

  private clearTimeout() {
    window.clearTimeout(this.timeoutId);
    delete this.timeoutId;
  }

  start() {
    this.clearTimeout();
    this.frame = 0;
    this.resume();
  }

  pause() {
    this.clearTimeout();
  }

  resume() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.msPerFrame = 1000 / this.fps;
    this.expectedNextFrameTime = this.startTime;
    this.tick();
  }

  stop() {
    this.clearTimeout();
    this.isRunning = false;
  }

  rewind() {
    this.stop();
    this.frame = 0;
  }

  setFPS(fps: number) {
    if (this.isRunning) {
      this.clearTimeout();
    }
    this.fps = fps;
    this.msPerFrame = 1000 / fps;
  }
}
