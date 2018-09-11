import { Camera } from '../camera';
import { Project } from '../project';
import { StringProperty } from '../property'

interface CameraMap { [ name: string ]: Camera; };

export class Scene {
  public name: string;
  private project: Project;
  private cameras: CameraMap;
  private currentCameraName: StringProperty;

  constructor (name: string, project: Project) {
    this.name = name || 'default';
    this.cameras = {};
    this.currentCameraName = new StringProperty(this, 'currentCameraName', 'default');
  }
}