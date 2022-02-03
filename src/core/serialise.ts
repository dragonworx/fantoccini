export interface Serialisable {
  serialise(): Promise<string>;
  deserialise(data: string): Promise<void>;
}
