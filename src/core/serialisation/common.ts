export type DataTypeName =
  | 'Int8'
  | 'Uint8'
  | 'Uint8Clamped'
  | 'Int16'
  | 'Uint16'
  | 'Int32'
  | 'Uint32'
  | 'Float32'
  | 'Float64'
  | 'BigInt64'
  | 'BigUint64';

export const DataTypeNames: Array<DataTypeName> = [
  'Int8',
  'Uint8',
  'Uint8Clamped',
  'Int16',
  'Uint16',
  'Int32',
  'Uint32',
  'Float32',
  'Float64',
  'BigInt64',
  'BigUint64',
];

export type FormatTypeName =
  | DataTypeName
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'ArrayBuffer'
  | 'Blob';

export const ByteSize = {
  Int8: 1,
  Uint8: 1,
  Uint8Clamped: 1,
  Int16: 2,
  Uint16: 2,
  Int32: 4,
  Uint32: 4,
  Float32: 4,
  Float64: 8,
  BigInt64: 8,
  BigUint64: 8,
};

export const Header = {
  Int8: 1,
  Uint8: 2,
  Uint8Clamped: 3,
  Int16: 4,
  Uint16: 5,
  Int32: 6,
  Uint32: 7,
  Float32: 8,
  Float64: 9,
  BigInt64: 10,
  BigUint64: 11,
  String: 12,
  Number: 13,
  Boolean: 14,
  ArrayBuffer: 15,
  Blob: 16,
  '[]': 17,
  '{}': 18,
  pop: 19,
};

export const TypeRange = {
  Int8: [-128, 127],
  Uint8: [0, 255],
  Uint8Clamped: [0, 255],
  Int16: [-32768, 32767],
  Uint16: [0, 65535],
  Int32: [-2147483648, 2147483647],
  Uint32: [0, 4294967295],
  Float32: [-3.4e38, 3.4e38],
  Float64: [-1.8e308, 1.8e308],
  BigInt64: [-2 ^ 63, 2 ^ (63 - 1)],
  BigUint64: [0, 2 ^ (64 - 1)],
};

export const isNumericRangeValid = (value: number, type: DataTypeName) => {
  const [min, max] = TypeRange[type];
  return value >= min && value <= max;
};

export const getNumericType = (value: number) =>
  DataTypeNames.find(dataType => isNumericRangeValid(value, dataType));
