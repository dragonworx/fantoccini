export type DataTypeName =
  | 'Int8'
  | 'Uint8'
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
  'Int16',
  'Uint16',
  'Int32',
  'Uint32',
  'Float32',
  'Float64',
  'BigInt64',
  'BigUint64',
];

export const ByteSize = {
  Int8: 1,
  Uint8: 1,
  Int16: 2,
  Uint16: 2,
  Int32: 4,
  Uint32: 4,
  Float32: 4,
  Float64: 8,
  BigInt64: 8,
  BigUint64: 8,
};

export const TypeRange = {
  Int8: [-128, 127],
  Uint8: [0, 255],
  Int16: [-32768, 32767],
  Uint16: [0, 65535],
  Int32: [-2147483648, 2147483647],
  Uint32: [0, 4294967295],
  Float32: [-3.4e38, 3.4e38],
  Float64: [-1.8e308, 1.8e308],
  BigInt64: [-2 ^ 63, 2 ^ (63 - 1)],
  BigUint64: [0, 2 ^ (64 - 1)],
};

export const GetTypeMethods = {
  Int8: 'getInt8',
  Uint8: 'getUint8',
  Int16: 'getInt16',
  Uint16: 'getUint16',
  Int32: 'getInt32',
  Uint32: 'getUint32',
  Float32: 'getFloat32',
  Float64: 'getFloat64',
  BigInt64: 'getBigInt64',
  BigUint64: 'getBigUint64',
};

export const SetTypeMethods = {
  Int8: 'setInt8',
  Uint8: 'setUint8',
  Int16: 'setInt16',
  Uint16: 'setUint16',
  Int32: 'setInt32',
  Uint32: 'setUint32',
  Float32: 'setFloat32',
  Float64: 'setFloat64',
  BigInt64: 'setBigInt64',
  BigUint64: 'setBigUint64',
};

export type FormatTypeName =
  | DataTypeName
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'ArrayBuffer'
  | 'Blob';

export const Header = [
  'Int8',
  'Uint8',
  'Int16',
  'Uint16',
  'Int32',
  'Uint32',
  'Float32',
  'Float64',
  'BigInt64',
  'BigUint64',
  'String',
  'Boolean',
  'ArrayBuffer',
  'Blob',
  '[]',
  '{}',
  'pop',
];

export const isHeaderNumeric = (headerType: number) =>
  headerType <= Header.indexOf('BigUint64');

export const headerDataTypeName = (headerType: number) =>
  DataTypeNames[headerType];

export const isNumericRangeValid = (value: number, type: DataTypeName) => {
  const [min, max] = TypeRange[type];
  return value >= min && value <= max;
};

export const getNumericType = (value: number) =>
  DataTypeNames.find(dataType => isNumericRangeValid(value, dataType));
