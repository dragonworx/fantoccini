export class BaseProperty<ValueType extends number | boolean | string> {
  protected _value: ValueType;

  constructor(defaultValue: ValueType) {
    this._value = defaultValue;
  }

  get() {
    return this._value;
  }

  set(newValue: ValueType) {
    this._value = newValue;
    return this;
  }
}

export enum NumericSnap {
  None,
  Ceiling,
  Floor,
  Round,
}

export class NumericProperty extends BaseProperty<number> {
  min: number;
  max: number;
  snap: NumericSnap = NumericSnap.None;

  constructor(
    value: number = 0,
    min: number = Number.NEGATIVE_INFINITY,
    max: number = Number.POSITIVE_INFINITY
  ) {
    super(value);
    this.min = min;
    this.max = max;
  }

  set(newValue: number) {
    const value = Math.max(this.min, newValue);
    this._value = Math.min(this.max, value);
    return this;
  }
}
