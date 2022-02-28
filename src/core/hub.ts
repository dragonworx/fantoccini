import EventEmitter from 'eventemitter3';

export type ProjectEvent = 'project.create' | 'project.init';
export type TransportEvent =
  | 'transport.play'
  | 'transport.pause'
  | 'transport.stop'
  | 'transport.rewind'
  | 'transport.seek';
export type AnimationEvent = 'frame.tick' | 'framerate.change';

export type CoreEvent = ProjectEvent | TransportEvent | AnimationEvent;

export type MenuBarEvent =
  | 'menu.file.new.project'
  | 'menu.file.open.project'
  | 'menu.file.save';

export type EditorEvent = MenuBarEvent;

export type Event = CoreEvent | EditorEvent;

const hub = new EventEmitter<Event>();

export function event(eventName: Event) {
  return eventName;
}

export default hub;
