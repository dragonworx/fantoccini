export * from "./types";
export * from "./menu";
export * from "./option";
export * from "./action";
export * from "./filters";

let id = 0;

export function nextId() {
  return ++id;
}
