export * from "./types";
export * from "./menu";
export * from "./option";
export * from "./command";
export * from "./filters";

let id = 0;

export function nextId() {
  return ++id;
}
