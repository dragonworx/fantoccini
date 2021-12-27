import EventEmitter from "eventemitter3";
import { element } from "./util";

export type MouseEvents = "mousedown";
export type BaseEvents = MouseEvents;
export type Handler = (...args: any[]) => any;

export abstract class Control<
  Props,
  RootElement extends HTMLElement,
  Events extends BaseEvents
> {
  element: RootElement;
  notifier: EventEmitter;

  constructor(protected readonly props: Props) {
    this.notifier = new EventEmitter();
    this.init();
  }

  protected init() {
    this.element = element<RootElement>(this.html());
    this.bindEvents();
    this.element.setAttribute("data-control-base", "");
    this.controlType().forEach((controlType) =>
      this.element.setAttribute(`data-control-${controlType}`, "")
    );
  }

  protected abstract html(): string;
  protected abstract controlType(): string[];

  on(eventName: Events, handler: Handler) {
    this.notifier.on(eventName, handler);
  }

  protected bindEvent(eventName: string, selfHandlerKey: string) {
    this.element.addEventListener(eventName, (e) => {
      (this[selfHandlerKey] as any)(e);
      this.notifier.emit(eventName, e);
    });
  }

  protected bindEvents() {
    this.bindEvent("mousedown", "onMouseDown");
  }

  protected onMouseDown(e: MouseEvent) {}

  protected select(query: string) {
    return this.element.querySelector(query) as HTMLElement;
  }

  protected selectAll(query: string) {
    return [...this.element.querySelectorAll(query)] as HTMLElement[];
  }

  append(control: Control<any, any, any>) {
    this.element.appendChild(control.element);
  }
}
