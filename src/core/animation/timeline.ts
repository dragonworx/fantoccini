// import { Property, PropertyType } from 'src/core/animation/property';
import hub from 'src/core/hub';
import Timecode from 'timecode-boss';

export class Timeline {
  timecode: Timecode;

  constructor(fps: number) {
    this.timecode = new Timecode(0, fps);

    hub.on('framerate.change', (newFps: number) => {
      this.timecode = new Timecode(0, newFps);
    });
  }

  tick(deltaMs: number, frameIndex: number) {}
}
