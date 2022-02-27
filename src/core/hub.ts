import EventEmitter from 'eventemitter3';

const CoreEvents = [
  'transport.tick',
  'transport.start',
  'transport.pause',
  'transport.resume',
  'transport.stop',
  'transport.fps.change',
] as const;

export type CoreEvent = typeof CoreEvents[number];

const EditorEvents = [
  'project.new',
  'project.create',
  'project.init',
  'project.save',
  'project.open',
];

export type EditorEvent = typeof EditorEvents[number];

const core = new EventEmitter<CoreEvent>();
const editor = new EventEmitter<EditorEvent>();

const hub = {
  core,
  editor,
};

export default hub;
