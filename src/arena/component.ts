class ComponentClass<Props extends Record<string, any>> {
  props: Props;

  constructor(props: Props) {
    this.props = props;
    Object.keys(props).forEach((key) =>
      Object.defineProperty(this, key, { get: () => this.props[key] })
    );
  }
}

export const Component = ComponentClass as {
  new <T>(data: T): ComponentClass<T> & T;
};
