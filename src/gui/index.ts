export * from "./types";
export * from "./menu";
export * from "./option";
export * from "./action";
export * from "./filters";
export * from "./tabs";
// export * from "./template";
// export * from "./stylesheet";
export * from "./storage";
export * from "./drag";

let id = 0;

export function nextId() {
  return ++id;
}
