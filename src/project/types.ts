import { Scene } from '../scene';

export type ProjectOptions = {
  width?: number;
  height?: number;
  backgroundColor?: any,
};

export interface SceneMap { [ name: string ]: Scene; };