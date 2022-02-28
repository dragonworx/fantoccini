import EventEmitter from 'eventemitter3';

export type CoreEvent = 'frame.tick';

export type EditorEvent =
  | 'project.new'
  | 'project.create'
  | 'project.init'
  | 'project.save'
  | 'project.open';

export type Event = CoreEvent | EditorEvent;

const hub = new EventEmitter<Event>();

export default hub;
