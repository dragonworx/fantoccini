type WithProps<P> = {
  props: P;
};

function extend<B extends WithProps<any>, P>(base: B, props: P) {
  return {
    ...base,
    props: {
      ...base.props,
      ...props,
    },
  } as B & P;
}

function Control<T, Props>(proto: T & WithProps<Props>) {
  return function (props: Partial<Props> = proto.props): typeof proto {
    return {
      ...proto,
      props: {
        ...proto.props,
        ...props,
      },
    };
  };
}

const baseProto = {
  props: {
    baseProp: 1,
  },
  template: 'abc',
  baseMethod() {
    this.props.baseProp++;
    return 'base';
  },
};

const subProto = {
  ...extend(baseProto, {
    subProp: 2,
  }),
  template: 'efg',
  subMethod() {
    return this.baseMethod() + '!';
  },
};

const subProto1 = {
  ...extend(subProto, {
    subProp1: 3,
  }),
  sub1Method() {},
};

const Sub = Control(subProto);
const sub = Sub();

const Sub1 = Control(subProto1);
const sub1 = Sub1();
const foo = sub1.subMethod();
const bar = sub1.props.baseProp;
const baz = sub1.template;
foo; //base
bar; //2
baz; //efg
