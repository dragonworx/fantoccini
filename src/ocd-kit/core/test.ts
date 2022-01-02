type WithProps<P> = {
  props: P;
};

function Extend<B extends WithProps<any>, S extends WithProps<any>>(
  base: B,
  sub: S
) {
  return {
    ...base,
    ...sub,
    props: {
      ...base.props,
      ...sub.props,
    },
  } as B & S;
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

const subProto = Extend(baseProto, {
  props: {
    subProp: 2,
  },
  template: 'efg',
  subMethod() {
    return baseProto.baseMethod.call(this);
  },
});

const subProto1 = Extend(subProto, {
  props: {
    subProp1: 3,
  },
  sub1Method() {},
});

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
