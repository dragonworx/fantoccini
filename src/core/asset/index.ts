export abstract class Asset {
  id: string;

  abstract get type(): string;
}
