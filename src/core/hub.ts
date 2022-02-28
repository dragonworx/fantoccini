import EventEmitter from 'eventemitter3';

export type ProjectEvent = 'project.create' | 'project.init';
export type AnimationEvent = 'frame.tick' | 'framerate.change';

export type CoreEvent = AnimationEvent | ProjectEvent;

export type MenuBarEvent =
  | 'menu.file.new.project'
  | 'menu.file.open.project'
  | 'menu.file.save';

export type EditorEvent = MenuBarEvent;

export type Event = CoreEvent | EditorEvent;

const hub = new EventEmitter<Event>();

export default hub;
