export enum FormatType {
  String,
  Boolean,
  Blob,
  ArrayBuffer,
  Float32,
}

type TypeDesc = Record<string, FormatType>;
type ObjectMap = Record<string, TypeDesc | RepeatArray | FormatType>;
type RepeatArray = Array<TypeDesc | ObjectMap>;

type Descriptor = TypeDesc | ObjectMap | RepeatArray | FormatType;

type Format = {
  header: {
    name: string;
    version: number;
  };
  body: Array<Record<string, Descriptor>> | Record<string, Descriptor>;
};

export type Document = Record<string, Descriptor>;

const format: Format = {
  header: {
    name: 'foo',
    version: 2,
  },
  body: {
    foo: FormatType.ArrayBuffer,
    items: [
      {
        title: FormatType.ArrayBuffer,
        subsection: {
          foo: FormatType.ArrayBuffer,
        },
        subitems: [
          {
            title: FormatType.ArrayBuffer,
          },
        ],
      },
    ],
    section: {
      foo: FormatType.ArrayBuffer,
    },
  },
};

// or just use custom interface and serialise given json object, then deserialise as return type
// -> better!

interface MyFileFormat {
  title: string;
  projects: Array<{
    title: string;
    fps: number;
  }>;
  assets: Record<string, { name: string; type: string }>;
}
